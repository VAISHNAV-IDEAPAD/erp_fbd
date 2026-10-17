const express = require("express");
const router = express.Router();

const controller = require("../controllers/indents");

router.get("/search", controller.search);
router.get("/dashboard", controller.dashboardSummary);

router.get("/", controller.getAll);
router.get("/next-number", controller.getNextIndentNo);
router.get("/:id", controller.getById);

router.post("/", controller.create);
router.post("/create", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);

router.patch("/:id/submit", controller.submit);

// Approval endpoints
router.patch("/:id/approve", controller.approve);
router.post("/:id/approve", controller.approve);
router.put("/:id/approve", controller.approve);

// Rejection endpoints
router.patch("/:id/reject", controller.reject);
router.post("/:id/reject", controller.reject);

// Cancel endpoint
router.patch("/:id/cancel", controller.cancel);

module.exports = router;