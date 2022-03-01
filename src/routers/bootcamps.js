const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  getBootcamps,
  getBootcampsInRadius,
  getBootcamp,
  craeteBootcamp,
  updateBootcamp,
  uploadBootcampImage,
  deleteBootcamp,
} = require("../controllers/bootcamps");

const courseRouter = require("./courses");

router.use("/:bootcampId/courses", courseRouter);

router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);

router.route("/").get(getBootcamps).post(craeteBootcamp);

router
  .route("/:id")
  .get(getBootcamp)
  .patch(updateBootcamp)
  .delete(deleteBootcamp);

router.route("/:id/photo").patch(uploadBootcampImage);

module.exports = router;
