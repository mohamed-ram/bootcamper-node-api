const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const geocoder = require("../utils/geocoder");
const path = require("path");

// @desc     Create new bootcamp
// @router   POST /api/bootcamps
// @access   Private
exports.craeteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);
  res.status(201).json({
    success: true,
    data: bootcamp,
  });
});

// @desc     Get all bootcamps
// @router   GET /api/bootcamps
// @access   Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  console.log(req.params);

  let query;

  const reqQuery = { ...req.query };

  // fields to exclude
  const removeFields = ["select", "sort", "page", "limit"];

  // loop over remove fields, delete them from req.query
  removeFields.forEach((param) => delete reqQuery[param]);

  let queryString = JSON.stringify(req.query);

  // create operators ($gte, $lt, ..)
  queryString = queryString.replace(
    /\b(lt|lte|gt|gte|in)\b/g,
    (match) => `$${match}`
  );

  // get resource
  query = Bootcamp.find(JSON.parse(queryString)).populate("courses");

  // select fields
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }

  // sort fields
  if (req.query.sort) {
    const sortFields = req.query.sort.split(",").join(" ");
    query = query.sort(sortFields);
  } else {
    query = query.sort("-createdAt");
  }

  // pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Bootcamp.countDocuments();
  const pagination = {};

  if (total > endIndex) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }
  query = query.limit(limit).skip(startIndex);

  // executing query
  const bootcamps = await query;
  res.json({
    success: true,
    count: bootcamps.length,
    pagination,
    data: bootcamps,
  });
});

// @desc     Get all bootcamps within radius
// @router   GET /api/bootcamps/radius/:zipcode/:distance
// @access   Public
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;
  const loc = await geocoder.geocode(zipcode);
  const long = loc[0].longitude;
  const lat = loc[0].latitude;
  // radius = distance / earth radius(6378km | 3963mi)
  const radius = distance / 6378;

  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[long, lat], radius] } },
  });

  res.json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
});

// @desc     Get single bootcamp
// @router   GET /api/bootcamps/:id
// @access   Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }
  res.json({ success: true, data: bootcamp });
});

// @desc     Update single bootcamp
// @router   PATCH /api/bootcamps/:id
// @access   Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const updates = Object.keys(req.body);

  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  updates.forEach((update) => {
    bootcamp[update] = req.body[update];
  });
  await bootcamp.save();
  res.json({ success: true, data: bootcamp });
});

// @desc     Delete single bootcamp
// @router   DELETE /api/bootcamps/:id
// @access   Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  bootcamp.remove();

  res.json({ success: true, data: bootcamp });
});

// @desc     upload bootcamp image
// @router   PUT /api/bootcamps/:id/imageUpload
// @access   Private
exports.uploadBootcampImage = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  if (!req.files) {
    return next(new ErrorResponse(`No image uploaded`, 400));
  }

  const file = req.files.file;
  console.log(file);
  // check if file is image
  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse(`Please uploade an image.`, 400));
  }

  // check file size
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${
          process.env.MAX_FILE_UPLOAD / 1000000
        } mb`,
        400
      )
    );
  }

  // custom file name
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;
  console.log(process.env.FILE_UPLOAD_PATH);
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    console.log(err);
    if (err) {
      return next(new ErrorResponse("Something wrong with file upload", 500));
    }

    await Bootcamp.findByIdAndUpdate(req.params.id, { image: file.name });

    res.json({ success: true, data: file.name });
  });
});
