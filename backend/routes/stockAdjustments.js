    const express = require("express");
    const router = express.Router();

    const controller =
    require("../controllers/stockAdjustmentController");

    router.get("/", controller.getAllAdjustments);
    router.get("/:id", controller.getAdjustmentById);
    router.post("/", controller.createAdjustment);
    router.delete("/:id", controller.deleteAdjustment);

    module.exports = router;