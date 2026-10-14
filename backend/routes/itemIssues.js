const express = require("express");
const router = express.Router();
const controller = require("../controllers/itemIssueController");

router.get("/", controller.getAllItemIssues);
router.get("/:id", controller.getItemIssueById);
router.post("/", controller.createItemIssue);
router.put("/:id", controller.updateItemIssue);
router.delete("/:id", controller.deleteItemIssue);

module.exports = router;
