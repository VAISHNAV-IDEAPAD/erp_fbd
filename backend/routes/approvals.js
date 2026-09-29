const express = require("express");
const router = express.Router();

const approvalController = require("../controllers/approvalController");

// ===========================================
// APPROVAL ENGINE
// ===========================================

// Submit Document
router.post("/submit", approvalController.submit);

// Approve Document
router.post("/approve", approvalController.approve);

// Reject Document
router.post("/reject", approvalController.reject);

// Reopen Document
router.post("/reopen", approvalController.reopen);

// Pending Documents
router.get("/pending", approvalController.getPending);

// Approval History
router.get(
    "/history/:moduleName/:documentId",
    approvalController.getHistory
);

module.exports = router;