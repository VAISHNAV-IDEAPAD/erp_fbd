const express = require("express");
const router = express.Router();
const materialIssueController =
require("../controllers/materialIssueController");

router.get("/", materialIssueController.getAllIssues);
router.get("/:id", materialIssueController.getIssueById);
router.post("/", materialIssueController.createIssue);

module.exports = router;