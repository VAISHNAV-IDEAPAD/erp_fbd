const express = require("express");
const router = express.Router();
const controller = require("../controllers/floorReturnController");

router.get("/", controller.getAllFloorReturns);
router.get("/:id", controller.getFloorReturnById);
router.post("/", controller.createFloorReturn);
router.put("/:id", controller.updateFloorReturn);
router.delete("/:id", controller.deleteFloorReturn);

module.exports = router;
