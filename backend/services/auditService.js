const db = require("../config/database");

exports.log = (

    moduleName,

    documentId,

    documentNo,

    action,

    field,

    oldValue,

    newValue,

    user,

    ip,

    device

)=>{

    return new Promise((resolve,reject)=>{

        db.run(

            `

            INSERT INTO AuditLogs(

                ModuleName,

                DocumentID,

                DocumentNo,

                Action,

                FieldName,

                OldValue,

                NewValue,

                ActionBy,

                IPAddress,

                Device

            )

            VALUES(?,?,?,?,?,?,?,?,?,?)

            `,

            [

                moduleName,

                documentId,

                documentNo,

                action,

                field,

                oldValue,

                newValue,

                user,

                ip,

                device

            ],

            err=>{

                if(err)
                    return reject(err);

                resolve();

            }

        );

    });

};