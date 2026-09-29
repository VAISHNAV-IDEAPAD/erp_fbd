const express = require("express");
const router = express.Router();
const controller = require("../controllers/pendingpoController");

router.get("/", controller.getPendingPO);

module.exports = router;