const express = require("express");
const router = express.Router();
const {
  getBootcamps,
  getBootcampsInRadius,
  getBootcamp,
  craeteBootcamp,
  updateBootcamp,
  deleteBootcamp,
} = require("../controllers/bootcamps");

router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);

router.route("/").get(getBootcamps).post(craeteBootcamp);

router
  .route("/:id")
  .get(getBootcamp)
  .patch(updateBootcamp)
  .delete(deleteBootcamp);

module.exports = router;
