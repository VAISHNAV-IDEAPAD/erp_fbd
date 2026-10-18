const express = require("express");
const router = express.Router();
const controller = require("../controllers/requirementsToPOController");

router.get("/", controller.getRequirementsToPO);
router.get("/filters", controller.getFilterOptions);
router.post("/upload", controller.uploadRequirementsToPO);

module.exports = router;
