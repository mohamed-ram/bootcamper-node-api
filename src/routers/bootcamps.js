const express = require("express");
const router = express.Router();
const {
  getBootcamps,
  getBootcamp,
  craeteBootcamp,
  updateBootcamp,
  deleteBootcamp,
} = require("../controllers/bootcamps");

router.route("/").get(getBootcamps).post(craeteBootcamp);

router
  .route("/:id")
  .get(getBootcamp)
  .patch(updateBootcamp)
  .delete(deleteBootcamp);

module.exports = router;
