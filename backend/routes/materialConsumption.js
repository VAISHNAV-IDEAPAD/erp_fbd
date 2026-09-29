const express = require("express");
const router = express.Router();

const controller =
require("../controllers/materialConsumptionController");

router.get(
    "/",
    controller.getMaterialConsumption
);

module.exports = router;