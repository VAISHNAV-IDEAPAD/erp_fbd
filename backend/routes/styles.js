const express = require("express");
const router = express.Router();
const styleController = require("../controllers/styleController");

router.get("/options", styleController.getStyleOptions);
router.get("/meta/options", styleController.getStyleOptions);
router.get("/", styleController.getAllStyles);
router.get("/:id", styleController.getStyleById);
router.post("/", styleController.createStyle);
router.put("/:id", styleController.updateStyle);
router.delete("/:id", styleController.deleteStyle);
router.post("/:id/duplicate", styleController.duplicateStyle);

module.exports = router;
