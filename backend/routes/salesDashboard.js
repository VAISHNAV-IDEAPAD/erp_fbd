const express = require("express");
const router = express.Router();

const controller = require("../controllers/salesDashboardController");

router.get("/", controller.getSalesDashboard);

module.exports = router;