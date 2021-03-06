const Course = require("../models/Course");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Bootcamp = require("../models/Bootcamp");

// @desc    get all courses
// @rout    GET /api/courses
// @rout    GET /api/bootcampa/:bootcampId/courses
exports.getCourses = asyncHandler(async (req, res, next) => {
  let query;

  if (req.params.bootcampId) {
    query = Course.find({ bootcamp: req.params.bootcampId });
  } else {
    query = Course.find().populate({
      path: "bootcamp",
      select: "name description",
    });
  }
  const courses = await query;

  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses,
  });
});

// @desc    get single course
// @rout    GET /api/courses/:courseId
exports.getSingleCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.courseId).populate({
    path: "bootcamp",
    select: "name description",
  });

  if (!course) {
    return next(
      new ErrorResponse(
        `Course is not exist with id of ${req.params.courseId}`,
        404
      )
    );
  }

  res.status(200).json({
    success: true,
    data: course,
  });
});

// @desc    create new course
// @rout    POST /api/courses
// @rout    POST /api/bootcamps/:bootcampId/courses
exports.createCourse = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;
  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Bootcamp is not exist with id of ${req.params.bootcampId}`,
        404
      )
    );
  }

  const course = await Course.create(req.body);

  res.status(200).json({
    success: true,
    data: course,
  });
});

// @desc    update course by its id
// @rout    POST /api/courses/:courseId
exports.updateCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.courseId);

  if (!course) {
    return next(
      new ErrorResponse(
        `Course is not exist with id of ${req.params.courseId}`,
        404
      )
    );
  }

  course = await Course.findByIdAndUpdate(req.params.courseId, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: course,
  });
});

// @desc    delete course by its id
// @rout    DELETE /api/courses/:courseId
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.courseId);

  if (!course) {
    return next(
      new ErrorResponse(
        `Course is not exist with id of ${req.params.courseId}`,
        404
      )
    );
  }

  await course.remove();

  res.status(200).json({
    success: true,
    data: course,
  });
});
