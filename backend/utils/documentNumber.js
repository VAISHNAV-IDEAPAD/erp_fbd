const db = require("../config/database");

function generateDocumentNumber(documentType) {

    return new Promise((resolve, reject) => {

        db.get(

            `SELECT *
             FROM DocumentSeries
             WHERE DocumentType=?`,

            [documentType],

            (err, row)=>{

                if(err) return reject(err);

                if(!row)
                    return reject(
                        new Error("Series not found.")
                    );

                const next = row.LastNumber + 1;

                const year = new Date().getFullYear();

                const month = String(
                    new Date().getMonth()+1
                ).padStart(2,"0");

                const number =
                    row.Prefix +
                    "/" +
                    year +
                    "/" +
                    month +
                    "/" +
                    String(next).padStart(
                        row.NumberLength,
                        "0"
                    );

                db.run(

                    `UPDATE DocumentSeries
                     SET LastNumber=?
                     WHERE SeriesID=?`,

                    [next,row.SeriesID],

                    updateErr=>{

                        if(updateErr)
                            return reject(updateErr);

                        resolve(number);

                    }

                );

            }

        );

    });

}

module.exports = generateDocumentNumber;