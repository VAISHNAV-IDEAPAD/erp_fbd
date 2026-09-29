const express = require("express");
const router = express.Router();
const controller = require("../controllers/productionOrdersController");

router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.post("/", controller.create);
router.put("/:id/status", controller.updateStatus);

module.exports = router;