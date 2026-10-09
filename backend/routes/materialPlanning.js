const express = require("express");
const router = express.Router();
const controller = require("../controllers/materialPlanningController");

router.get("/masters", controller.getMasters);
router.post("/calculate", controller.calculateMRP);
router.post("/prepare-indent", controller.prepareIndent);

module.exports = router;
