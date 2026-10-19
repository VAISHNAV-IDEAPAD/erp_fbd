const express = require("express");
const router = express.Router();
const controller = require("../controllers/rejectionReturnController");

router.get("/", controller.getAll);
router.get("/grn-items", controller.getGrnItems);
router.get("/:id", controller.getById);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

module.exports = router;
