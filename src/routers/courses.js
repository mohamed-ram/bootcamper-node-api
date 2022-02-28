const express = require("express");
const router = express.Router({ mergeParams: true });

const {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  getSingleCourse,
} = require("../controllers/courses");

router.route("/").get(getCourses).post(createCourse);
router
  .route("/:courseId")
  .get(getSingleCourse)
  .patch(updateCourse)
  .delete(deleteCourse);

module.exports = router;
