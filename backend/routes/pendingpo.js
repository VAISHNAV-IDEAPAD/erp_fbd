const express = require("express");
const router = express.Router();
const controller = require("../controllers/pendingPOController");

router.get("/", controller.getPendingPO);

module.exports = router;