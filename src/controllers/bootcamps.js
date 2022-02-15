const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

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
  const bootcamps = await Bootcamp.find();
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
  const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  res.json({ success: true, data: bootcamp });
});
