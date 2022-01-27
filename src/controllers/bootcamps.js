const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/errorResponse");

// @desc     Create new bootcamp
// @router   POST /api/bootcamps
// @access   Private
exports.craeteBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({
      success: true,
      data: bootcamp,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error,
    });
  }
};

// @desc     Get all bootcamps
// @router   GET /api/bootcamps
// @access   Public
exports.getBootcamps = async (req, res, next) => {
  try {
    const bootcamps = await Bootcamp.find();
    res.json({
      success: true,
      count: bootcamps.length,
      data: bootcamps,
    });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

// @desc     Get single bootcamp
// @router   GET /api/bootcamps/:id
// @access   Public
exports.getBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
      return res
        .status(404)
        .json({ success: false, error: "Bootcamp is not exist." });
    }
    res.json({ success: true, data: bootcamp });
  } catch (error) {
    // res.status(500).json({ success: false, error });
    next(new ErrorResponse("Bootcamp is not exist", 404));
  }
};

// @desc     Update single bootcamp
// @router   PATCH /api/bootcamps/:id
// @access   Private
exports.updateBootcamp = async (req, res, next) => {
  try {
    const updates = Object.keys(req.body);

    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
      return res
        .status(404)
        .json({ success: false, error: "Bootcamp is not exist." });
    }

    updates.forEach((update) => {
      bootcamp[update] = req.body[update];
    });
    await bootcamp.save();
    res.json({ success: true, data: bootcamp });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

// @desc     Delete single bootcamp
// @router   DELETE /api/bootcamps/:id
// @access   Private
exports.deleteBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

    if (!bootcamp) {
      return res
        .status(404)
        .json({ success: false, error: "Bootcamp is not exist." });
    }

    res.json({ success: true, data: bootcamp });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};
