const express = require("express");

const router = express.Router();

const controller = require("../controllers/financeDashboardController");

router.get("/", controller.getFinanceDashboard);

module.exports = router;