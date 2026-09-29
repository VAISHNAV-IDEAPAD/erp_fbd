const express = require("express");

const router = express.Router();

const {
    getAllCompanies,
    getCompanyById,
    createCompany,
    updateCompany,
    deleteCompany
} = require("../controllers/companies");


// ======================================================
// COMPANY MASTER ROUTES
// ======================================================

// GET all companies
router.get(
    "/",
    getAllCompanies
);


// GET company by ID
router.get(
    "/:id",
    getCompanyById
);


// CREATE company
router.post(
    "/",
    createCompany
);


// UPDATE company
router.put(
    "/:id",
    updateCompany
);


// DELETE company
router.delete(
    "/:id",
    deleteCompany
);


module.exports = router;