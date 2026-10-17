const express = require("express");
const router = express.Router();
const controller = require("../controllers/purchaseReturnController");

router.get("/", controller.getAll);
router.get("/next-number", controller.getNextNumber);
router.get("/:id", controller.getById);
router.post("/", controller.create);
router.patch("/:id/cancel", controller.cancel);

module.exports = router;
