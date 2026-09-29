const express = require("express");
const router = express.Router();

const stockIssueController =
require("../controllers/stockIssueController");

router.get(
    "/details/all",
    stockIssueController.getIssueDetails
);

router.get(
    "/",
    stockIssueController.getAllIssues
);

router.get(
    "/:id",
    stockIssueController.getIssueById
);

router.post(
    "/",
    stockIssueController.createIssue
);

module.exports = router;