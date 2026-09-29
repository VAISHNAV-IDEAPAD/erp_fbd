const approvalService = require("../services/approvalService");

// ==========================================
// SUBMIT
// ==========================================

exports.submit = async (req, res) => {

    try {

        const result = await approvalService.submit(

            req.body.moduleName,
            req.body.documentId,
            req.body.user,
            req.body.remarks

        );

        res.json(result);

    } catch (err) {

        res.status(500).json({

            success: false,
            message: err.message

        });

    }

};

// ==========================================
// APPROVE
// ==========================================

exports.approve = async (req, res) => {

    try {

        const result = await approvalService.approve(

            req.body.moduleName,
            req.body.documentId,
            req.body.user,
            req.body.remarks

        );

        res.json(result);

    } catch (err) {

        res.status(500).json({

            success: false,
            message: err.message

        });

    }

};

// ==========================================
// REJECT
// ==========================================

exports.reject = async (req, res) => {

    try {

        const result = await approvalService.reject(

            req.body.moduleName,
            req.body.documentId,
            req.body.user,
            req.body.remarks

        );

        res.json(result);

    } catch (err) {

        res.status(500).json({

            success: false,
            message: err.message

        });

    }

};

// ==========================================
// REOPEN
// ==========================================

exports.reopen = async (req, res) => {

    try {

        const result = await approvalService.reopen(

            req.body.moduleName,
            req.body.documentId,
            req.body.user,
            req.body.remarks

        );

        res.json(result);

    } catch (err) {

        res.status(500).json({

            success: false,
            message: err.message

        });

    }

};

// ==========================================
// PENDING
// ==========================================

exports.getPending = async (req, res) => {

    try {

        const rows = await approvalService.getPending(

            req.query.role

        );

        res.json({

            success: true,

            data: rows

        });

    } catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

// ==========================================
// HISTORY
// ==========================================

exports.getHistory = async (req, res) => {

    try {

        const rows = await approvalService.getHistory(

            req.params.moduleName,

            req.params.documentId

        );

        res.json({

            success: true,

            data: rows

        });

    } catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};