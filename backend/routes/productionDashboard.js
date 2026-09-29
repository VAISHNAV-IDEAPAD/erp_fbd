const express = require("express");
const router = express.Router();

const controller = require("../controllers/productionDashboardController");

router.get("/", controller.getProductionDashboard);

module.exports = router;