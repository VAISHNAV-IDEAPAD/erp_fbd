const express = require("express");
const router = express.Router();

const controller =
require("../controllers/wipReportController");

router.get("/", controller.getWIPReport);

module.exports = router;
