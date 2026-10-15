const express = require("express");
const router = express.Router();
const controller = require("../controllers/itemRequisitionController");

router.get("/", controller.getAllItemRequisitions);
router.get("/:id", controller.getItemRequisitionById);
router.post("/", controller.createItemRequisition);
router.put("/:id", controller.updateItemRequisition);
router.delete("/:id", controller.deleteItemRequisition);

module.exports = router;
