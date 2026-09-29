const express = require("express");

const router = express.Router();

const controller = require("../controllers/misDashboardController");

router.get("/", controller.getMISDashboard);

module.exports = router;