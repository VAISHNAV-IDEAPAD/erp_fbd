const db = require("../config/database");

// ======================================================
// GET ALL INTERNAL ORDERS
// ======================================================
exports.getAll = (req, res) => {
    try {
        const {
            customer,
            status,
            materialSource,
            enteredBy,
            search,
            page = 1,
            limit = 15,
            sortBy = "IONo",
            sortDir = "DESC"
        } = req.query;

        let query = "SELECT * FROM InternalOrders WHERE 1=1";
        const params = [];

        if (customer && customer.trim()) {
            query += " AND Customer LIKE ?";
            params.push(`%${customer.trim()}%`);
        }

        if (status && status !== "All") {
            query += " AND Status = ?";
            params.push(status);
        }

        if (materialSource && materialSource !== "All") {
            query += " AND MaterialSource = ?";
            params.push(materialSource);
        }

        if (enteredBy && enteredBy.trim()) {
            query += " AND EnteredBy LIKE ?";
            params.push(`%${enteredBy.trim()}%`);
        }

        if (search && search.trim()) {
            query += " AND (IONo LIKE ? OR Customer LIKE ? OR CustomerOrderNo LIKE ? OR SoNo LIKE ? OR Season LIKE ?)";
            const term = `%${search.trim()}%`;
            params.push(term, term, term, term, term);
        }

        // Count total matching
        const countQuery = query.replace("SELECT *", "SELECT COUNT(*) as total");
        db.get(countQuery, params, (countErr, countRow) => {
            if (countErr) {
                return res.status(500).json({ success: false, message: countErr.message });
            }

            const total = countRow ? countRow.total : 0;
            const validSortColumns = ["IOID", "IONo", "IODate", "Customer", "TotalQty", "Status", "Season"];
            const orderCol = validSortColumns.includes(sortBy) ? sortBy : "IOID";
            const orderDir = sortDir.toUpperCase() === "ASC" ? "ASC" : "DESC";

            let pagedQuery = `${query} ORDER BY ${orderCol} ${orderDir}`;
            const pageNum = parseInt(page, 10) || 1;
            const limitNum = limit === "all" ? 1000 : (parseInt(limit, 10) || 15);
            const offset = (pageNum - 1) * limitNum;

            pagedQuery += " LIMIT ? OFFSET ?";
            const pagedParams = [...params, limitNum, offset];

            db.all(pagedQuery, pagedParams, (err, rows) => {
                if (err) {
                    return res.status(500).json({ success: false, message: err.message });
                }

                res.json({
                    success: true,
                    count: rows.length,
                    total,
                    page: pageNum,
                    totalPages: Math.ceil(total / limitNum) || 1,
                    data: rows
                });
            });
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ======================================================
// GET INTERNAL ORDER BY ID OR IONO
// ======================================================
exports.getById = (req, res) => {
    const { id } = req.params;
    const isNumeric = /^\d+$/.test(id);
    const sql = isNumeric ? "SELECT * FROM InternalOrders WHERE IOID = ?" : "SELECT * FROM InternalOrders WHERE IONo = ?";

    db.get(sql, [id], (err, order) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        if (!order) return res.status(404).json({ success: false, message: "Internal Order not found" });

        db.all("SELECT * FROM InternalOrderDetails WHERE IOID = ? ORDER BY DetailID ASC", [order.IOID], (dErr, details) => {
            if (dErr) return res.status(500).json({ success: false, message: dErr.message });
            res.json({
                success: true,
                data: {
                    ...order,
                    details: details || []
                }
            });
        });
    });
};

// ======================================================
// CREATE INTERNAL ORDER (MASTER)
// ======================================================
exports.create = (req, res) => {
    const {
        IONo,
        VersionNo = 0,
        IODate = new Date().toISOString().split("T")[0],
        Customer,
        CustomerID = 1,
        CustomerOrderNo = "",
        CustomerPlanNo = "",
        Season = "MFO-M2-2027",
        SoNo = "",
        MaterialSource = "Import",
        InternalMemo = "",
        OrderMessage = "",
        Status = "Open",
        DeliveryDate = "",
        DeliveryLocation = "Plot No. 9B Warehouse",
        Currency = "USD",
        PaymentTerms = "60 Days LC",
        ShipmentMode = "Sea",
        PriceTerm = "FOB",
        EnteredBy = "Admin",
        details = []
    } = req.body;

    if (!Customer) {
        return res.status(400).json({ success: false, message: "Customer is required" });
    }

    // Auto-generate IONo if omitted
    const generatedIONo = IONo || `IO/9B/2627/${Math.floor(Date.now() % 1000 + 200)}`;

    const totalQty = details.reduce((sum, item) => sum + (parseFloat(item.Qty) || 0), 0);
    const noOfRows = details.length > 0 ? details.length : 1;

    const sql = `
        INSERT INTO InternalOrders (
            IONo, VersionNo, IODate, Customer, CustomerID, CustomerOrderNo, CustomerPlanNo,
            Season, SoNo, TotalQty, NoOfRows, MaterialSource, InternalMemo, OrderMessage,
            Status, EnteredBy, DeliveryDate, DeliveryLocation, Currency, PaymentTerms,
            ShipmentMode, PriceTerm
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.run(sql, [
        generatedIONo, VersionNo, IODate, Customer, CustomerID, CustomerOrderNo, CustomerPlanNo,
        Season, SoNo, totalQty, noOfRows, MaterialSource, InternalMemo, OrderMessage,
        Status, EnteredBy, DeliveryDate, DeliveryLocation, Currency, PaymentTerms,
        ShipmentMode, PriceTerm
    ], function (err) {
        if (err) return res.status(500).json({ success: false, message: err.message });
        const newIOID = this.lastID;

        if (details.length > 0) {
            const detailStmt = db.prepare(`
                INSERT INTO InternalOrderDetails (
                    IOID, IONo, StyleNo, Description, Colour, SizeBreakdown, Qty, Rate, Amount, ExFactoryDate, Remarks
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `);

            details.forEach(item => {
                const qty = parseFloat(item.Qty) || 0;
                const rate = parseFloat(item.Rate) || 0;
                const amount = parseFloat(item.Amount) || (qty * rate);
                detailStmt.run([
                    newIOID, generatedIONo, item.StyleNo || "STYLE-01", item.Description || "",
                    item.Colour || "", item.SizeBreakdown || "", qty, rate, amount,
                    item.ExFactoryDate || "", item.Remarks || ""
                ]);
            });
            detailStmt.finalize();
        }

        res.status(201).json({
            success: true,
            message: "Internal Order created successfully",
            IOID: newIOID,
            IONo: generatedIONo
        });
    });
};

// ======================================================
// UPDATE INTERNAL ORDER
// ======================================================
exports.update = (req, res) => {
    const { id } = req.params;
    const {
        IODate, Customer, CustomerOrderNo, CustomerPlanNo, Season, SoNo,
        MaterialSource, InternalMemo, OrderMessage, Status, DeliveryDate,
        DeliveryLocation, Currency, PaymentTerms, ShipmentMode, PriceTerm,
        details = []
    } = req.body;

    const totalQty = details.reduce((sum, item) => sum + (parseFloat(item.Qty) || 0), 0);
    const noOfRows = details.length > 0 ? details.length : 1;

    const sql = `
        UPDATE InternalOrders SET
            IODate = COALESCE(?, IODate),
            Customer = COALESCE(?, Customer),
            CustomerOrderNo = COALESCE(?, CustomerOrderNo),
            CustomerPlanNo = COALESCE(?, CustomerPlanNo),
            Season = COALESCE(?, Season),
            SoNo = COALESCE(?, SoNo),
            TotalQty = CASE WHEN ? > 0 THEN ? ELSE TotalQty END,
            NoOfRows = CASE WHEN ? > 0 THEN ? ELSE NoOfRows END,
            MaterialSource = COALESCE(?, MaterialSource),
            InternalMemo = COALESCE(?, InternalMemo),
            OrderMessage = COALESCE(?, OrderMessage),
            Status = COALESCE(?, Status),
            DeliveryDate = COALESCE(?, DeliveryDate),
            DeliveryLocation = COALESCE(?, DeliveryLocation),
            Currency = COALESCE(?, Currency),
            PaymentTerms = COALESCE(?, PaymentTerms),
            ShipmentMode = COALESCE(?, ShipmentMode),
            PriceTerm = COALESCE(?, PriceTerm),
            UpdatedAt = CURRENT_TIMESTAMP
        WHERE IOID = ?
    `;

    db.run(sql, [
        IODate, Customer, CustomerOrderNo, CustomerPlanNo, Season, SoNo,
        totalQty, totalQty, noOfRows, noOfRows, MaterialSource, InternalMemo,
        OrderMessage, Status, DeliveryDate, DeliveryLocation, Currency,
        PaymentTerms, ShipmentMode, PriceTerm, id
    ], function (err) {
        if (err) return res.status(500).json({ success: false, message: err.message });

        if (details.length > 0) {
            db.run("DELETE FROM InternalOrderDetails WHERE IOID = ?", [id], () => {
                const detailStmt = db.prepare(`
                    INSERT INTO InternalOrderDetails (
                        IOID, IONo, StyleNo, Description, Colour, SizeBreakdown, Qty, Rate, Amount, ExFactoryDate, Remarks
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `);
                details.forEach(item => {
                    const qty = parseFloat(item.Qty) || 0;
                    const rate = parseFloat(item.Rate) || 0;
                    detailStmt.run([
                        id, req.body.IONo || "IO-REF", item.StyleNo || "", item.Description || "",
                        item.Colour || "", item.SizeBreakdown || "", qty, rate, (qty * rate),
                        item.ExFactoryDate || "", item.Remarks || ""
                    ]);
                });
                detailStmt.finalize();
            });
        }

        res.json({ success: true, message: "Internal Order updated successfully" });
    });
};

// ======================================================
// TOGGLE STATUS (OPEN / CLOSED)
// ======================================================
exports.updateStatus = (req, res) => {
    const { id } = req.params;
    const { status, closedBy = "Current User" } = req.body;
    const closedDate = status === "Closed" ? new Date().toISOString().split("T")[0] : null;
    const closedByUser = status === "Closed" ? closedBy : null;

    db.run(
        "UPDATE InternalOrders SET Status = ?, ClosedDate = ?, ClosedBy = ?, UpdatedAt = CURRENT_TIMESTAMP WHERE IOID = ?",
        [status, closedDate, closedByUser, id],
        function (err) {
            if (err) return res.status(500).json({ success: false, message: err.message });
            res.json({ success: true, message: `Status updated to ${status}` });
        }
    );
};

// ======================================================
// BULK ACTIONS
// ======================================================
exports.bulkAction = (req, res) => {
    const { action, ids = [] } = req.body;
    if (!ids || ids.length === 0) {
        return res.status(400).json({ success: false, message: "No IDs provided" });
    }

    const placeholders = ids.map(() => "?").join(",");

    if (action === "close") {
        const today = new Date().toISOString().split("T")[0];
        db.run(
            `UPDATE InternalOrders SET Status = 'Closed', ClosedDate = ?, ClosedBy = 'Admin' WHERE IOID IN (${placeholders})`,
            [today, ...ids],
            function (err) {
                if (err) return res.status(500).json({ success: false, message: err.message });
                res.json({ success: true, message: `Closed ${this.changes} orders` });
            }
        );
    } else if (action === "open") {
        db.run(
            `UPDATE InternalOrders SET Status = 'Open', ClosedDate = NULL, ClosedBy = NULL WHERE IOID IN (${placeholders})`,
            ids,
            function (err) {
                if (err) return res.status(500).json({ success: false, message: err.message });
                res.json({ success: true, message: `Reopened ${this.changes} orders` });
            }
        );
    } else if (action === "delete") {
        db.run(`DELETE FROM InternalOrders WHERE IOID IN (${placeholders})`, ids, function (err) {
            if (err) return res.status(500).json({ success: false, message: err.message });
            res.json({ success: true, message: `Deleted ${this.changes} orders` });
        });
    } else {
        res.status(400).json({ success: false, message: "Invalid action" });
    }
};

// ======================================================
// DELETE SINGLE ORDER
// ======================================================
exports.delete = (req, res) => {
    const { id } = req.params;
    db.run("DELETE FROM InternalOrders WHERE IOID = ?", [id], function (err) {
        if (err) return res.status(500).json({ success: false, message: err.message });
        db.run("DELETE FROM InternalOrderDetails WHERE IOID = ?", [id]);
        res.json({ success: true, message: "Internal Order deleted" });
    });
};
