const express = require("express");
const router = express.Router();
const techSheetController = require("../controllers/techSheetController");

router.get("/", techSheetController.getAllTechSheets);
router.get("/:id", techSheetController.getTechSheetById);
router.post("/", techSheetController.createTechSheet);
router.put("/:id", techSheetController.updateTechSheet);
router.delete("/:id", techSheetController.deleteTechSheet);

// Approval lifecycle & revision
router.post("/:id/submit", techSheetController.submitTechSheet);
router.post("/:id/approve", techSheetController.approveTechSheet);
router.post("/:id/reject", techSheetController.rejectTechSheet);
router.post("/:id/revision", techSheetController.createRevision);

module.exports = router;
