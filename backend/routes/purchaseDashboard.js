const express = require("express");
const router = express.Router();

const controller = require("../controllers/purchaseDashboardController");

router.get("/", controller.getPurchaseDashboard);

module.exports = router;