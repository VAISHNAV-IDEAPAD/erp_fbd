const express = require("express");
const router = express.Router();

const bomController = require("../controllers/bomController");


// ================= BOM COSTING =================
router.get(
    "/:id/costing",
    bomController.getBOMCosting
);


// ================= GET ALL BOM =================
router.get(
    "/",
    bomController.getAllBOMs
);


// ================= GET SINGLE BOM =================
router.get(
    "/:id",
    bomController.getBOMById
);


// ================= CREATE BOM =================
router.post(
    "/",
    bomController.createBOM
);


// ================= UPDATE BOM =================
router.put(
    "/:id",
    bomController.updateBOM
);


// ================= DELETE BOM =================
router.delete(
    "/:id",
    bomController.deleteBOM
);
router.get("/:id/costing", bomController.getBOMCosting);

router.get(
    "/:id/explode/:qty",
    bomController.explodeBOM
);

router.get("/:id", bomController.getBOMById);

module.exports = router;