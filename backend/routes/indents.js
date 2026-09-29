const express = require("express");
const router = express.Router();

const controller = require("../controllers/indents");

router.get("/search", controller.search);
router.get("/dashboard", controller.dashboardSummary);

router.get("/", controller.getAll);
router.get("/:id", controller.getById);

router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);

router.patch("/:id/submit", controller.submit);
router.patch("/:id/approve", controller.approve);
router.patch("/:id/cancel", controller.cancel);

module.exports = router;