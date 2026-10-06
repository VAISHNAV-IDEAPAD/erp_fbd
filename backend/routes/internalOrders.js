const express = require("express");
const router = express.Router();
const controller = require("../controllers/internalOrderController");

router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.patch("/:id/status", controller.updateStatus);
router.post("/bulk-action", controller.bulkAction);
router.delete("/:id", controller.delete);

module.exports = router;
