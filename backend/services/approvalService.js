const db = require("../config/database");

// =====================================================
// TABLE MAPPING
// =====================================================

const TABLES = {

    INDENT: {
        table: "Indents",
        id: "IndentID"
    },

    PR: {
        table: "PurchaseRequisitions",
        id: "PRID"
    },

    PO: {
        table: "PurchaseOrders",
        id: "POID"
    },

    SO: {
        table: "SalesOrders",
        id: "SOID"
    },

    PRODUCTION: {
        table: "ProductionOrders",
        id: "ProductionID"
    }

};

// =====================================================
// GET TABLE
// =====================================================

function getTable(moduleName) {

    const table = TABLES[moduleName];

    if (!table)
        throw new Error("Invalid Module");

    return table;

}
// =====================================================
// SUBMIT
// =====================================================

exports.submit = (moduleName, documentId, user, remarks = "") => {

    return new Promise((resolve, reject) => {

        const module = getTable(moduleName);

        db.serialize(() => {

            db.run("BEGIN TRANSACTION");

            db.get(

                `
                SELECT *
                FROM ApprovalLevels
                WHERE ModuleName=?
                ORDER BY LevelNo
                LIMIT 1
                `,

                [moduleName],

                (err, level) => {

                    if (err) {

                        db.run("ROLLBACK");

                        return reject(err);

                    }

                    if (!level) {

                        db.run("ROLLBACK");

                        return reject(
                            new Error("Approval Level not configured.")
                        );

                    }

                    db.run(

                        `
                        UPDATE ${module.table}

                        SET Status='Submitted'

                        WHERE ${module.id}=?
                        `,

                        [documentId]

                    );

                    db.run(

                        `
                        INSERT INTO ApprovalHistory(

                            ModuleName,

                            DocumentID,

                            LevelNo,

                            Action,

                            ActionBy,

                            Remarks

                        )

                        VALUES(?,?,?,?,?,?)

                        `,

                        [

                            moduleName,

                            documentId,

                            level.LevelNo,

                            "Submitted",

                            user,

                            remarks

                        ],

                        err => {

                            if (err) {

                                db.run("ROLLBACK");

                                return reject(err);

                            }

                            db.run("COMMIT");

                            resolve({

                                success: true,

                                message: "Document Submitted",

                                nextRole: level.RoleName

                            });

                        }

                    );

                }

            );

        });

    });

};
// =====================================================
// APPROVE
// =====================================================

exports.approve = (moduleName, documentId, user, remarks = "") => {

    return new Promise((resolve, reject) => {

        const module = getTable(moduleName);

        db.serialize(() => {

            db.run("BEGIN TRANSACTION");

            db.get(
                `
                SELECT *
                FROM ApprovalHistory
                WHERE ModuleName = ?
                AND DocumentID = ?
                ORDER BY LevelNo DESC
                LIMIT 1
                `,
                [moduleName, documentId],
                (err, history) => {

                    if (err) {
                        db.run("ROLLBACK");
                        return reject(err);
                    }

                    if (!history) {
                        db.run("ROLLBACK");
                        return reject(new Error("Approval history not found."));
                    }

                    db.get(
                        `
                        SELECT *
                        FROM ApprovalLevels
                        WHERE ModuleName = ?
                        AND LevelNo = ?
                        `,
                        [moduleName, history.LevelNo + 1],
                        (levelErr, nextLevel) => {

                            if (levelErr) {
                                db.run("ROLLBACK");
                                return reject(levelErr);
                            }

                            // ===================================
                            // FINAL APPROVAL
                            // ===================================

                            if (!nextLevel) {

                                db.run(
                                    `
                                    UPDATE ${module.table}
                                    SET Status='Approved'
                                    WHERE ${module.id}=?
                                    `,
                                    [documentId]
                                );

                                db.run(
                                    `
                                    INSERT INTO ApprovalHistory
                                    (
                                        ModuleName,
                                        DocumentID,
                                        LevelNo,
                                        Action,
                                        ActionBy,
                                        Remarks
                                    )
                                    VALUES(?,?,?,?,?,?)
                                    `,
                                    [
                                        moduleName,
                                        documentId,
                                        history.LevelNo,
                                        "Approved",
                                        user,
                                        remarks
                                    ]
                                );

                                db.run("COMMIT");

                                return resolve({
                                    success: true,
                                    status: "Approved"
                                });

                            }

                            // ===================================
                            // NEXT LEVEL
                            // ===================================

                            db.run(
                                `
                                INSERT INTO ApprovalHistory
                                (
                                    ModuleName,
                                    DocumentID,
                                    LevelNo,
                                    Action,
                                    ActionBy,
                                    Remarks
                                )
                                VALUES(?,?,?,?,?,?)
                                `,
                                [
                                    moduleName,
                                    documentId,
                                    nextLevel.LevelNo,
                                    "Pending",
                                    user,
                                    remarks
                                ],
                                err => {

                                    if (err) {

                                        db.run("ROLLBACK");

                                        return reject(err);

                                    }

                                    db.run("COMMIT");

                                    resolve({

                                        success: true,

                                        nextRole: nextLevel.RoleName,

                                        level: nextLevel.LevelNo

                                    });

                                }

                            );

                        }

                    );

                }

            );

        });

    });

};
// =====================================================
// REJECT
// =====================================================

exports.reject = (moduleName, documentId, user, remarks = "") => {

    return new Promise((resolve, reject) => {

        const module = getTable(moduleName);

        db.serialize(() => {

            db.run("BEGIN TRANSACTION");

            db.run(
                `
                UPDATE ${module.table}
                SET Status='Rejected'
                WHERE ${module.id}=?
                `,
                [documentId]
            );

            db.run(
                `
                INSERT INTO ApprovalHistory
                (
                    ModuleName,
                    DocumentID,
                    LevelNo,
                    Action,
                    ActionBy,
                    Remarks
                )
                VALUES(?,?,?,?,?,?)
                `,
                [
                    moduleName,
                    documentId,
                    0,
                    "Rejected",
                    user,
                    remarks
                ],
                err => {

                    if (err) {

                        db.run("ROLLBACK");

                        return reject(err);

                    }

                    db.run("COMMIT");

                    resolve({
                        success: true
                    });

                }

            );

        });

    });

};
// =====================================================
// REOPEN
// =====================================================

exports.reopen = (moduleName, documentId, user, remarks = "") => {

    return new Promise((resolve, reject) => {

        const module = getTable(moduleName);

        db.run(

            `
            UPDATE ${module.table}
            SET Status='Draft'
            WHERE ${module.id}=?
            `,

            [documentId],

            err => {

                if (err)
                    return reject(err);

                db.run(

                    `
                    INSERT INTO ApprovalHistory
                    (
                        ModuleName,
                        DocumentID,
                        LevelNo,
                        Action,
                        ActionBy,
                        Remarks
                    )
                    VALUES(?,?,?,?,?,?)
                    `,

                    [
                        moduleName,
                        documentId,
                        0,
                        "Reopened",
                        user,
                        remarks
                    ],

                    err => {

                        if (err)
                            return reject(err);

                        resolve({
                            success: true
                        });

                    }

                );

            }

        );

    });

};
// =====================================================
// GET PENDING APPROVALS
// =====================================================

exports.getPending = (userRole) => {

    return new Promise((resolve, reject) => {

        const sql = `

            SELECT

                AH.ModuleName,

                AH.DocumentID,

                AH.LevelNo,

                AL.RoleName,

                AH.Action,

                AH.ActionDate

            FROM ApprovalHistory AH

            INNER JOIN ApprovalLevels AL

            ON AH.ModuleName = AL.ModuleName
            AND AH.LevelNo = AL.LevelNo

            WHERE

                AH.Action='Pending'

                AND AL.RoleName = ?

            ORDER BY AH.ActionDate ASC

        `;

        db.all(sql,[userRole],(err,rows)=>{

            if(err)
                return reject(err);

            resolve(rows);

        });

    });

};
// =====================================================
// APPROVAL HISTORY
// =====================================================

exports.getHistory = (moduleName, documentId) => {

    return new Promise((resolve,reject)=>{

        db.all(

            `

            SELECT

                LevelNo,

                Action,

                ActionBy,

                Remarks,

                ActionDate

            FROM ApprovalHistory

            WHERE

                ModuleName=?

                AND DocumentID=?

            ORDER BY

                ActionDate

            `,

            [

                moduleName,

                documentId

            ],

            (err,rows)=>{

                if(err)
                    return reject(err);

                resolve(rows);

            }

        );

    });

};