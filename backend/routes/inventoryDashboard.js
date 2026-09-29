const express = require("express");
const router = express.Router();

const controller = require("../controllers/inventoryDashboardController");

router.get("/", controller.getInventoryDashboard);

module.exports = router;