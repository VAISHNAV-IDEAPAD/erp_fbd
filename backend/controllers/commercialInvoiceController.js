const db = require("../config/database");

const SAMPLE_INVOICES = [
    {
        InvoicePrefix: "TI/9B/2627/",
        InvoiceSeq: 17,
        InvoiceNo: "TI/9B/2627/17",
        InvoiceDate: "18-10-2026",
        InvoiceRef: "EXP/TB/2627/017",
        ReverseCharge: "No",
        FreightCharges: "Collect",
        ExporterName: "Plot No. 9B",
        BranchCode: "09B",
        ExporterAddress: "Alpine Apparels Pvt. Ltd.\nPLOT NO.9B, SECTOR-27A\nFARIDABAD\nHARYANA-121003",
        ExporterTel: "+91-129-4009000",
        ExporterEmail: "exports@alpineapparels.com",
        ExporterIEC: "0595023412",
        ExporterGSTNo: "06AADCA0100D1ZS",
        ExporterCINNo: "U74899DL1995PTC068562",
        ExporterPANNo: "AADCA0100D",
        ExporterState: "HARYANA",
        BuyerNo: "5500071001",
        BuyerDate: "13-07-2026",
        OtherReference: "IO/9B/2627/60",
        SegmentCode: "BAGS-EXP",
        DateOfSupply: "18-10-2026",
        PlaceOfSupply: "NEW YORK, USA",
        ConsigneeName: "TORY BURCH LLC",
        ConsigneeAddress: "11 WEST 19TH STREET, 7TH FLOOR, NEW YORK, NY 10011, USA",
        ConsigneeGSTNo: "N/A",
        ConsigneePANNo: "N/A",
        ConsigneeState: "NEW YORK",
        Currency: "USD",
        ExchangeRate: 84.15,
        ShipToName: "TORY BURCH DISTRIBUTION CENTER",
        ShipToAddress: "1000 TORY BURCH WAY, MCDONOUGH, GA 30253, USA",
        ShipToGSTNo: "",
        ShipToPANNo: "",
        ShipToState: "GEORGIA",
        Destination: "NEW YORK, USA",
        BuyerOtherName: "",
        BuyerOtherAddress: "",
        NotifyParty: "EXPEDITORS INTERNATIONAL INC.",
        NotifyPartyAddress: "JFK INTERNATIONAL AIRPORT, JAMAICA, NY 11430, USA",
        NotifyPartyLocation: "NEW YORK",
        ForwarderName: "EXPEDITORS INTERNATIONAL",
        PreCarriageBy: "ROAD",
        PlaceOfReceipt: "FARIDABAD",
        VesselFlightNo: "EK-511",
        PortOfLoading: "IGI AIRPORT, NEW DELHI",
        PortOfDischarge: "JFK, NEW YORK",
        FinalDestination: "NEW YORK, USA",
        MarksAndNos: "TB/AAPL/01-25",
        NoAndKindOfPkgs: "25 CORRUGATED CARTONS",
        CountryOfOrigin: "INDIA",
        CountryOfFinalDest: "UNITED STATES",
        StandardUnitQty: "PCS",
        ExportPreferentialDetails: "RODTEP",
        TermsOfDeliveryPayment: "FOB NEW DELHI / 60 DAYS NET",
        DescriptionOfGoods: "171524 BRITTEN CONVERTIBLE CROSSBODY (LB-17097) V2 - FOREST BROWN",
        Declaration1: "We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.",
        Declaration2: "Goods exported under LUT / Bond without payment of IGST.",
        ProductionPackNos: "PP/9B/2627/101, PP/9B/2627/102",
        Location: "Plot No. 9B",
        TotalQty: 250,
        NoOfRows: 2,
        SubTotal: 31250.0,
        TotalAmount: 31250.0,
        ItemsJSON: JSON.stringify([
            {
                packNo: "PP/9B/2627/101",
                ioNo: "IO/9B/2627/60",
                styleNo: "171524",
                description: "171524 BRITTEN CONVERTIBLE CROSSBODY (LB-17097) V2 - FOREST BROWN",
                hsnCode: "42022110",
                uom: "PCS",
                qty: 150,
                rate: 125.0,
                amount: 18750.0
            },
            {
                packNo: "PP/9B/2627/102",
                ioNo: "IO/9B/2627/61",
                styleNo: "189386",
                description: "189386 ROBINSON WALLET ON A CHAIN (LB-17228) V2 - AGED TAN",
                hsnCode: "42023120",
                uom: "PCS",
                qty: 100,
                rate: 125.0,
                amount: 12500.0
            }
        ]),
        Status: "Active"
    },
    {
        InvoicePrefix: "TI/9B/2627/",
        InvoiceSeq: 16,
        InvoiceNo: "TI/9B/2627/16",
        InvoiceDate: "15-10-2026",
        InvoiceRef: "EXP/WS/2627/016",
        ReverseCharge: "No",
        FreightCharges: "Collect",
        ExporterName: "Plot No. 9B",
        BranchCode: "09B",
        ExporterAddress: "Alpine Apparels Pvt. Ltd.\nPLOT NO.9B, SECTOR-27A\nFARIDABAD\nHARYANA-121003",
        ExporterTel: "+91-129-4009000",
        ExporterEmail: "exports@alpineapparels.com",
        ExporterIEC: "0595023412",
        ExporterGSTNo: "06AADCA0100D1ZS",
        ExporterCINNo: "U74899DL1995PTC068562",
        ExporterPANNo: "AADCA0100D",
        ExporterState: "HARYANA",
        BuyerNo: "5437771MGM",
        BuyerDate: "13-07-2026",
        OtherReference: "IO/68/2627/322",
        SegmentCode: "LUGGAGE-EXP",
        DateOfSupply: "15-10-2026",
        PlaceOfSupply: "SINGAPORE",
        ConsigneeName: "WILLIAMS SONOMA SINGAPORE PTE LTD",
        ConsigneeAddress: "1 RAFFLES PLACE, #36-01 ONE RAFFLES PLACE, SINGAPORE 048616",
        ConsigneeGSTNo: "N/A",
        ConsigneePANNo: "N/A",
        ConsigneeState: "SINGAPORE",
        Currency: "USD",
        ExchangeRate: 84.1,
        ShipToName: "WILLIAMS SONOMA LOGISTICS HUB",
        ShipToAddress: "3250 VAN NESS AVENUE, SAN FRANCISCO, CA 94109, USA",
        ShipToGSTNo: "",
        ShipToPANNo: "",
        ShipToState: "CALIFORNIA",
        Destination: "OAKLAND, USA",
        BuyerOtherName: "",
        BuyerOtherAddress: "",
        NotifyParty: "DHL GLOBAL FORWARDING",
        NotifyPartyAddress: "CHANGI AIRFREIGHT CENTRE, SINGAPORE",
        NotifyPartyLocation: "SINGAPORE",
        ForwarderName: "DHL GLOBAL FORWARDING",
        PreCarriageBy: "BY TRUCK",
        PlaceOfReceipt: "ICD TUGHLAKABAD",
        VesselFlightNo: "MAERSK SENANG / 641E",
        PortOfLoading: "NHAVA SHEVA (INNSA)",
        PortOfDischarge: "OAKLAND, USA",
        FinalDestination: "SAN FRANCISCO, USA",
        MarksAndNos: "WSS/AAPL/01-18",
        NoAndKindOfPkgs: "18 EXPORT CARTONS",
        CountryOfOrigin: "INDIA",
        CountryOfFinalDest: "UNITED STATES",
        StandardUnitQty: "PCS",
        ExportPreferentialDetails: "RODTEP",
        TermsOfDeliveryPayment: "FOB NHAVA SHEVA / LC AT SIGHT",
        DescriptionOfGoods: "283860 MERCEROVERNIGHTER:CHOC (TB-701) & 283910 BECKETTCANVASGMTBAG:CHOC",
        Declaration1: "We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.",
        Declaration2: "Supply meant for export under LUT without payment of integrated tax.",
        ProductionPackNos: "PP/9B/2627/094",
        Location: "Plot No. 9B",
        TotalQty: 180,
        NoOfRows: 1,
        SubTotal: 26100.0,
        TotalAmount: 26100.0,
        ItemsJSON: JSON.stringify([
            {
                packNo: "PP/9B/2627/094",
                ioNo: "IO/68/2627/322",
                styleNo: "283860",
                description: "283860 MERCEROVERNIGHTER:CHOC (TB-701) - CHOCOLATE",
                hsnCode: "42021220",
                uom: "PCS",
                qty: 180,
                rate: 145.0,
                amount: 26100.0
            }
        ]),
        Status: "Active"
    },
    {
        InvoicePrefix: "TI/9B/2627/",
        InvoiceSeq: 15,
        InvoiceNo: "TI/9B/2627/15",
        InvoiceDate: "10-10-2026",
        InvoiceRef: "EXP/RL/2627/015",
        ReverseCharge: "No",
        FreightCharges: "Prepaid",
        ExporterName: "Plot No. 9B",
        BranchCode: "09B",
        ExporterAddress: "Alpine Apparels Pvt. Ltd.\nPLOT NO.9B, SECTOR-27A\nFARIDABAD\nHARYANA-121003",
        ExporterTel: "+91-129-4009000",
        ExporterEmail: "exports@alpineapparels.com",
        ExporterIEC: "0595023412",
        ExporterGSTNo: "06AADCA0100D1ZS",
        ExporterCINNo: "U74899DL1995PTC068562",
        ExporterPANNo: "AADCA0100D",
        ExporterState: "HARYANA",
        BuyerNo: "4500891204",
        BuyerDate: "05-07-2026",
        OtherReference: "IO/9B/2627/84",
        SegmentCode: "SLG-EXP",
        DateOfSupply: "10-10-2026",
        PlaceOfSupply: "LONDON, UK",
        ConsigneeName: "RALPH LAUREN EUROPE SARL",
        ConsigneeAddress: "24 ROUTE DE LA GALAISE, 1228 PLAN-LES-OUATES, GENEVA, SWITZERLAND",
        ConsigneeGSTNo: "N/A",
        ConsigneePANNo: "N/A",
        ConsigneeState: "GENEVA",
        Currency: "EUR",
        ExchangeRate: 91.4,
        ShipToName: "RALPH LAUREN UK LOGISTICS",
        ShipToAddress: "UNIT 4, MAGNA PARK, LUTTERWORTH LE17 4XH, UNITED KINGDOM",
        ShipToGSTNo: "",
        ShipToPANNo: "",
        ShipToState: "LEICESTERSHIRE",
        Destination: "LONDON, UK",
        BuyerOtherName: "",
        BuyerOtherAddress: "",
        NotifyParty: "KUEHNE + NAGEL LTD.",
        NotifyPartyAddress: "HEATHROW CARGO CENTRE, HOUNSLOW TW6 3JF, UK",
        NotifyPartyLocation: "LONDON",
        ForwarderName: "KUEHNE + NAGEL",
        PreCarriageBy: "ROAD",
        PlaceOfReceipt: "FARIDABAD",
        VesselFlightNo: "BA-142",
        PortOfLoading: "IGI AIRPORT, NEW DELHI",
        PortOfDischarge: "LONDON HEATHROW (LHR)",
        FinalDestination: "LUTTERWORTH, UK",
        MarksAndNos: "RL/AAPL/01-12",
        NoAndKindOfPkgs: "12 CORRUGATED BOXES",
        CountryOfOrigin: "INDIA",
        CountryOfFinalDest: "UNITED KINGDOM",
        StandardUnitQty: "PCS",
        ExportPreferentialDetails: "REXREGISTERED",
        TermsOfDeliveryPayment: "CIF LONDON / 45 DAYS",
        DescriptionOfGoods: "178665 ROMY STRAW BUCKET BAG (CLB-2201 A) V3 - NATURAL",
        Declaration1: "We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.",
        Declaration2: "Export under Duty Drawback & RoDTEP scheme.",
        ProductionPackNos: "PP/9B/2627/088",
        Location: "Plot No. 9B",
        TotalQty: 120,
        NoOfRows: 1,
        SubTotal: 16800.0,
        TotalAmount: 16800.0,
        ItemsJSON: JSON.stringify([
            {
                packNo: "PP/9B/2627/088",
                ioNo: "IO/9B/2627/84",
                styleNo: "178665",
                description: "178665 ROMY STRAW BUCKET BAG (CLB-2201 A) V3 - NATURAL",
                hsnCode: "42022290",
                uom: "PCS",
                qty: 120,
                rate: 140.0,
                amount: 16800.0
            }
        ]),
        Status: "Active"
    }
];

function ensureTableAndSeed() {
    db.get("SELECT COUNT(*) AS cnt FROM CommercialInvoices", [], (err, row) => {
        if (err) {
            // If table does not exist yet, create it then seed
            if (db.pool) {
                const pgCreateSql = `
                    CREATE TABLE IF NOT EXISTS CommercialInvoices (
                        CommercialInvoiceID SERIAL PRIMARY KEY,
                        InvoicePrefix TEXT DEFAULT 'TI/9B/2627/',
                        InvoiceSeq INTEGER DEFAULT 18,
                        InvoiceNo TEXT,
                        InvoiceDate TEXT,
                        InvoiceRef TEXT,
                        ReverseCharge TEXT DEFAULT 'No',
                        FreightCharges TEXT DEFAULT 'Collect',
                        ExporterName TEXT DEFAULT 'Plot No. 9B',
                        BranchCode TEXT,
                        ExporterAddress TEXT,
                        ExporterTel TEXT,
                        ExporterEmail TEXT,
                        ExporterIEC TEXT,
                        ExporterGSTNo TEXT DEFAULT '06AADCA0100D1ZS',
                        ExporterCINNo TEXT DEFAULT 'U74899DL1995PTC068562',
                        ExporterPANNo TEXT DEFAULT 'AADCA0100D',
                        ExporterState TEXT DEFAULT 'HARYANA',
                        BuyerNo TEXT,
                        BuyerDate TEXT,
                        OtherReference TEXT,
                        SegmentCode TEXT,
                        DateOfSupply TEXT,
                        PlaceOfSupply TEXT,
                        ConsigneeName TEXT,
                        ConsigneeAddress TEXT,
                        ConsigneeGSTNo TEXT,
                        ConsigneePANNo TEXT,
                        ConsigneeState TEXT,
                        Currency TEXT DEFAULT 'USD',
                        ExchangeRate DOUBLE PRECISION DEFAULT 0.0,
                        ShipToName TEXT,
                        ShipToAddress TEXT,
                        ShipToGSTNo TEXT,
                        ShipToPANNo TEXT,
                        ShipToState TEXT,
                        Destination TEXT,
                        BuyerOtherName TEXT,
                        BuyerOtherAddress TEXT,
                        NotifyParty TEXT,
                        NotifyPartyAddress TEXT,
                        NotifyPartyLocation TEXT,
                        ForwarderName TEXT,
                        PreCarriageBy TEXT,
                        PlaceOfReceipt TEXT,
                        VesselFlightNo TEXT,
                        PortOfLoading TEXT,
                        PortOfDischarge TEXT,
                        FinalDestination TEXT,
                        MarksAndNos TEXT,
                        NoAndKindOfPkgs TEXT,
                        CountryOfOrigin TEXT DEFAULT 'INDIA',
                        CountryOfFinalDest TEXT,
                        StandardUnitQty TEXT,
                        ExportPreferentialDetails TEXT,
                        TermsOfDeliveryPayment TEXT,
                        DescriptionOfGoods TEXT,
                        Declaration1 TEXT,
                        Declaration2 TEXT,
                        ProductionPackNos TEXT,
                        Location TEXT DEFAULT 'Plot No. 9B',
                        TotalQty DOUBLE PRECISION DEFAULT 0,
                        NoOfRows INTEGER DEFAULT 1,
                        SubTotal DOUBLE PRECISION DEFAULT 0,
                        TotalAmount DOUBLE PRECISION DEFAULT 0,
                        ItemsJSON TEXT,
                        Status TEXT DEFAULT 'Active',
                        CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    )
                `;
                db.pool.query(pgCreateSql).then(() => seedRows()).catch(() => {});
                return;
            }
            const createSql = `
                CREATE TABLE IF NOT EXISTS CommercialInvoices (
                    CommercialInvoiceID INTEGER PRIMARY KEY AUTOINCREMENT,
                    InvoicePrefix TEXT DEFAULT 'TI/9B/2627/',
                    InvoiceSeq INTEGER DEFAULT 18,
                    InvoiceNo TEXT,
                    InvoiceDate TEXT,
                    InvoiceRef TEXT,
                    ReverseCharge TEXT DEFAULT 'No',
                    FreightCharges TEXT DEFAULT 'Collect',
                    ExporterName TEXT DEFAULT 'Plot No. 9B',
                    BranchCode TEXT,
                    ExporterAddress TEXT,
                    ExporterTel TEXT,
                    ExporterEmail TEXT,
                    ExporterIEC TEXT,
                    ExporterGSTNo TEXT DEFAULT '06AADCA0100D1ZS',
                    ExporterCINNo TEXT DEFAULT 'U74899DL1995PTC068562',
                    ExporterPANNo TEXT DEFAULT 'AADCA0100D',
                    ExporterState TEXT DEFAULT 'HARYANA',
                    BuyerNo TEXT,
                    BuyerDate TEXT,
                    OtherReference TEXT,
                    SegmentCode TEXT,
                    DateOfSupply TEXT,
                    PlaceOfSupply TEXT,
                    ConsigneeName TEXT,
                    ConsigneeAddress TEXT,
                    ConsigneeGSTNo TEXT,
                    ConsigneePANNo TEXT,
                    ConsigneeState TEXT,
                    Currency TEXT DEFAULT 'USD',
                    ExchangeRate REAL DEFAULT 0.0,
                    ShipToName TEXT,
                    ShipToAddress TEXT,
                    ShipToGSTNo TEXT,
                    ShipToPANNo TEXT,
                    ShipToState TEXT,
                    Destination TEXT,
                    BuyerOtherName TEXT,
                    BuyerOtherAddress TEXT,
                    NotifyParty TEXT,
                    NotifyPartyAddress TEXT,
                    NotifyPartyLocation TEXT,
                    ForwarderName TEXT,
                    PreCarriageBy TEXT,
                    PlaceOfReceipt TEXT,
                    VesselFlightNo TEXT,
                    PortOfLoading TEXT,
                    PortOfDischarge TEXT,
                    FinalDestination TEXT,
                    MarksAndNos TEXT,
                    NoAndKindOfPkgs TEXT,
                    CountryOfOrigin TEXT DEFAULT 'INDIA',
                    CountryOfFinalDest TEXT,
                    StandardUnitQty TEXT,
                    ExportPreferentialDetails TEXT,
                    TermsOfDeliveryPayment TEXT,
                    DescriptionOfGoods TEXT,
                    Declaration1 TEXT,
                    Declaration2 TEXT,
                    ProductionPackNos TEXT,
                    Location TEXT DEFAULT 'Plot No. 9B',
                    TotalQty REAL DEFAULT 0,
                    NoOfRows INTEGER DEFAULT 1,
                    SubTotal REAL DEFAULT 0,
                    TotalAmount REAL DEFAULT 0,
                    ItemsJSON TEXT,
                    Status TEXT DEFAULT 'Active',
                    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `;
            db.run(createSql, [], () => seedRows());
            return;
        }
        if (Number(row?.cnt || 0) === 0) {
            seedRows();
        }
    });
}

function seedRows() {
    for (const inv of SAMPLE_INVOICES) {
        const cols = Object.keys(inv);
        const placeholders = cols.map(() => "?").join(", ");
        const vals = cols.map((k) => inv[k]);
        db.run(
            `INSERT INTO CommercialInvoices (${cols.join(", ")}) VALUES (${placeholders})`,
            vals
        );
    }
}

setTimeout(ensureTableAndSeed, 800);

exports.getCommercialInvoices = (req, res) => {
    const { customer, search } = req.query;
    const conditions = [];
    const params = [];

    if (customer && String(customer).trim()) {
        conditions.push("(LOWER(ConsigneeName) LIKE LOWER(?) OR LOWER(BuyerNo) LIKE LOWER(?))");
        const c = `%${String(customer).trim()}%`;
        params.push(c, c);
    }

    if (search && String(search).trim()) {
        const q = `%${String(search).trim()}%`;
        conditions.push(
            "(LOWER(InvoiceNo) LIKE LOWER(?) OR LOWER(BuyerNo) LIKE LOWER(?) OR LOWER(ConsigneeName) LIKE LOWER(?) OR LOWER(ProductionPackNos) LIKE LOWER(?) OR LOWER(PlaceOfSupply) LIKE LOWER(?))"
        );
        params.push(q, q, q, q, q);
    }

    const whereSql = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
    const sql = `SELECT * FROM CommercialInvoices ${whereSql} ORDER BY CommercialInvoiceID DESC`;

    db.all(sql, params, (err, rows) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Error fetching Commercial Invoices",
                error: err.message
            });
        }
        const parsed = (rows || []).map((r) => {
            let items = [];
            try {
                items = r.ItemsJSON ? JSON.parse(r.ItemsJSON) : [];
            } catch (_) {
                items = [];
            }
            return { ...r, items };
        });
        res.json({
            success: true,
            data: parsed
        });
    });
};

exports.getCommercialInvoiceById = (req, res) => {
    const { id } = req.params;
    db.get("SELECT * FROM CommercialInvoices WHERE CommercialInvoiceID = ?", [id], (err, row) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Error fetching Commercial Invoice",
                error: err.message
            });
        }
        if (!row) {
            return res.status(404).json({
                success: false,
                message: "Commercial Invoice not found"
            });
        }
        let items = [];
        try {
            items = row.ItemsJSON ? JSON.parse(row.ItemsJSON) : [];
        } catch (_) {
            items = [];
        }
        res.json({
            success: true,
            data: { ...row, items }
        });
    });
};

exports.createCommercialInvoice = (req, res) => {
    const b = req.body || {};
    const prefix = b.InvoicePrefix || "TI/9B/2627/";
    const seq = Number(b.InvoiceSeq) || 18;
    const invoiceNo = b.InvoiceNo || `${prefix}${seq}`;
    const items = Array.isArray(b.items) ? b.items : [];
    const totalQty =
        b.TotalQty !== undefined
            ? Number(b.TotalQty)
            : items.reduce((sum, it) => sum + (Number(it.qty) || 0), 0);
    const subTotal =
        b.SubTotal !== undefined
            ? Number(b.SubTotal)
            : items.reduce((sum, it) => sum + (Number(it.amount) || 0), 0);
    const totalAmount = b.TotalAmount !== undefined ? Number(b.TotalAmount) : subTotal;
    const noOfRows = b.NoOfRows !== undefined ? Number(b.NoOfRows) : Math.max(1, items.length);

    const record = {
        InvoicePrefix: prefix,
        InvoiceSeq: seq,
        InvoiceNo: invoiceNo,
        InvoiceDate: b.InvoiceDate || new Date().toISOString().slice(0, 10),
        InvoiceRef: b.InvoiceRef || "",
        ReverseCharge: b.ReverseCharge || "No",
        FreightCharges: b.FreightCharges || "Collect",
        ExporterName: b.ExporterName || "Plot No. 9B",
        BranchCode: b.BranchCode || "",
        ExporterAddress:
            b.ExporterAddress ||
            "Alpine Apparels Pvt. Ltd.\nPLOT NO.9B, SECTOR-27A\nFARIDABAD\nHARYANA-121003",
        ExporterTel: b.ExporterTel || "",
        ExporterEmail: b.ExporterEmail || "",
        ExporterIEC: b.ExporterIEC || "",
        ExporterGSTNo: b.ExporterGSTNo || "06AADCA0100D1ZS",
        ExporterCINNo: b.ExporterCINNo || "U74899DL1995PTC068562",
        ExporterPANNo: b.ExporterPANNo || "AADCA0100D",
        ExporterState: b.ExporterState || "HARYANA",
        BuyerNo: b.BuyerNo || "",
        BuyerDate: b.BuyerDate || "",
        OtherReference: b.OtherReference || "",
        SegmentCode: b.SegmentCode || "",
        DateOfSupply: b.DateOfSupply || "",
        PlaceOfSupply: b.PlaceOfSupply || "",
        ConsigneeName: b.ConsigneeName || "",
        ConsigneeAddress: b.ConsigneeAddress || "",
        ConsigneeGSTNo: b.ConsigneeGSTNo || "",
        ConsigneePANNo: b.ConsigneePANNo || "",
        ConsigneeState: b.ConsigneeState || "",
        Currency: b.Currency || "USD",
        ExchangeRate: Number(b.ExchangeRate) || 0.0,
        ShipToName: b.ShipToName || "",
        ShipToAddress: b.ShipToAddress || "",
        ShipToGSTNo: b.ShipToGSTNo || "",
        ShipToPANNo: b.ShipToPANNo || "",
        ShipToState: b.ShipToState || "",
        Destination: b.Destination || "",
        BuyerOtherName: b.BuyerOtherName || "",
        BuyerOtherAddress: b.BuyerOtherAddress || "",
        NotifyParty: b.NotifyParty || "",
        NotifyPartyAddress: b.NotifyPartyAddress || "",
        NotifyPartyLocation: b.NotifyPartyLocation || b.Destination || "",
        ForwarderName: b.ForwarderName || "",
        PreCarriageBy: b.PreCarriageBy || "",
        PlaceOfReceipt: b.PlaceOfReceipt || "",
        VesselFlightNo: b.VesselFlightNo || "",
        PortOfLoading: b.PortOfLoading || "",
        PortOfDischarge: b.PortOfDischarge || "",
        FinalDestination: b.FinalDestination || "",
        MarksAndNos: b.MarksAndNos || "",
        NoAndKindOfPkgs: b.NoAndKindOfPkgs || "",
        CountryOfOrigin: b.CountryOfOrigin || "INDIA",
        CountryOfFinalDest: b.CountryOfFinalDest || "",
        StandardUnitQty: b.StandardUnitQty || "",
        ExportPreferentialDetails: b.ExportPreferentialDetails || "",
        TermsOfDeliveryPayment: b.TermsOfDeliveryPayment || "",
        DescriptionOfGoods: b.DescriptionOfGoods || "",
        Declaration1: b.Declaration1 || "",
        Declaration2: b.Declaration2 || "",
        ProductionPackNos: Array.isArray(b.ProductionPackNos)
            ? b.ProductionPackNos.join(", ")
            : b.ProductionPackNos || "",
        Location: b.Location || "Plot No. 9B",
        TotalQty: totalQty,
        NoOfRows: noOfRows,
        SubTotal: subTotal,
        TotalAmount: totalAmount,
        ItemsJSON: JSON.stringify(items),
        Status: b.Status || "Active"
    };

    const cols = Object.keys(record);
    const placeholders = cols.map(() => "?").join(", ");
    const vals = cols.map((k) => record[k]);

    db.run(
        `INSERT INTO CommercialInvoices (${cols.join(", ")}) VALUES (${placeholders})`,
        vals,
        function (err) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Error creating Commercial Invoice",
                    error: err.message
                });
            }
            res.status(201).json({
                success: true,
                message: "Commercial Invoice saved successfully",
                data: {
                    CommercialInvoiceID: this.lastID,
                    ...record,
                    items
                }
            });
        }
    );
};

exports.updateCommercialInvoice = (req, res) => {
    const { id } = req.params;
    const b = req.body || {};
    const items = Array.isArray(b.items) ? b.items : [];
    const totalQty =
        b.TotalQty !== undefined
            ? Number(b.TotalQty)
            : items.reduce((sum, it) => sum + (Number(it.qty) || 0), 0);
    const subTotal =
        b.SubTotal !== undefined
            ? Number(b.SubTotal)
            : items.reduce((sum, it) => sum + (Number(it.amount) || 0), 0);
    const totalAmount = b.TotalAmount !== undefined ? Number(b.TotalAmount) : subTotal;
    const noOfRows = b.NoOfRows !== undefined ? Number(b.NoOfRows) : Math.max(1, items.length);

    const sql = `
        UPDATE CommercialInvoices SET
            InvoicePrefix = ?,
            InvoiceSeq = ?,
            InvoiceNo = ?,
            InvoiceDate = ?,
            InvoiceRef = ?,
            ReverseCharge = ?,
            FreightCharges = ?,
            ExporterName = ?,
            BranchCode = ?,
            ExporterAddress = ?,
            ExporterTel = ?,
            ExporterEmail = ?,
            ExporterIEC = ?,
            ExporterGSTNo = ?,
            ExporterCINNo = ?,
            ExporterPANNo = ?,
            ExporterState = ?,
            BuyerNo = ?,
            BuyerDate = ?,
            OtherReference = ?,
            SegmentCode = ?,
            DateOfSupply = ?,
            PlaceOfSupply = ?,
            ConsigneeName = ?,
            ConsigneeAddress = ?,
            ConsigneeGSTNo = ?,
            ConsigneePANNo = ?,
            ConsigneeState = ?,
            Currency = ?,
            ExchangeRate = ?,
            ShipToName = ?,
            ShipToAddress = ?,
            ShipToGSTNo = ?,
            ShipToPANNo = ?,
            ShipToState = ?,
            Destination = ?,
            BuyerOtherName = ?,
            BuyerOtherAddress = ?,
            NotifyParty = ?,
            NotifyPartyAddress = ?,
            NotifyPartyLocation = ?,
            ForwarderName = ?,
            PreCarriageBy = ?,
            PlaceOfReceipt = ?,
            VesselFlightNo = ?,
            PortOfLoading = ?,
            PortOfDischarge = ?,
            FinalDestination = ?,
            MarksAndNos = ?,
            NoAndKindOfPkgs = ?,
            CountryOfOrigin = ?,
            CountryOfFinalDest = ?,
            StandardUnitQty = ?,
            ExportPreferentialDetails = ?,
            TermsOfDeliveryPayment = ?,
            DescriptionOfGoods = ?,
            Declaration1 = ?,
            Declaration2 = ?,
            ProductionPackNos = ?,
            Location = ?,
            TotalQty = ?,
            NoOfRows = ?,
            SubTotal = ?,
            TotalAmount = ?,
            ItemsJSON = ?,
            Status = ?
        WHERE CommercialInvoiceID = ?
    `;

    const prefix = b.InvoicePrefix || "TI/9B/2627/";
    const seq = Number(b.InvoiceSeq) || 18;
    const invoiceNo = b.InvoiceNo || `${prefix}${seq}`;

    const params = [
        prefix,
        seq,
        invoiceNo,
        b.InvoiceDate || "",
        b.InvoiceRef || "",
        b.ReverseCharge || "No",
        b.FreightCharges || "Collect",
        b.ExporterName || "Plot No. 9B",
        b.BranchCode || "",
        b.ExporterAddress || "",
        b.ExporterTel || "",
        b.ExporterEmail || "",
        b.ExporterIEC || "",
        b.ExporterGSTNo || "06AADCA0100D1ZS",
        b.ExporterCINNo || "U74899DL1995PTC068562",
        b.ExporterPANNo || "AADCA0100D",
        b.ExporterState || "HARYANA",
        b.BuyerNo || "",
        b.BuyerDate || "",
        b.OtherReference || "",
        b.SegmentCode || "",
        b.DateOfSupply || "",
        b.PlaceOfSupply || "",
        b.ConsigneeName || "",
        b.ConsigneeAddress || "",
        b.ConsigneeGSTNo || "",
        b.ConsigneePANNo || "",
        b.ConsigneeState || "",
        b.Currency || "USD",
        Number(b.ExchangeRate) || 0.0,
        b.ShipToName || "",
        b.ShipToAddress || "",
        b.ShipToGSTNo || "",
        b.ShipToPANNo || "",
        b.ShipToState || "",
        b.Destination || "",
        b.BuyerOtherName || "",
        b.BuyerOtherAddress || "",
        b.NotifyParty || "",
        b.NotifyPartyAddress || "",
        b.NotifyPartyLocation || b.Destination || "",
        b.ForwarderName || "",
        b.PreCarriageBy || "",
        b.PlaceOfReceipt || "",
        b.VesselFlightNo || "",
        b.PortOfLoading || "",
        b.PortOfDischarge || "",
        b.FinalDestination || "",
        b.MarksAndNos || "",
        b.NoAndKindOfPkgs || "",
        b.CountryOfOrigin || "INDIA",
        b.CountryOfFinalDest || "",
        b.StandardUnitQty || "",
        b.ExportPreferentialDetails || "",
        b.TermsOfDeliveryPayment || "",
        b.DescriptionOfGoods || "",
        b.Declaration1 || "",
        b.Declaration2 || "",
        Array.isArray(b.ProductionPackNos)
            ? b.ProductionPackNos.join(", ")
            : b.ProductionPackNos || "",
        b.Location || "Plot No. 9B",
        totalQty,
        noOfRows,
        subTotal,
        totalAmount,
        JSON.stringify(items),
        b.Status || "Active",
        id
    ];

    db.run(sql, params, function (err) {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Error updating Commercial Invoice",
                error: err.message
            });
        }
        res.json({
            success: true,
            message: "Commercial Invoice updated successfully"
        });
    });
};

exports.deleteCommercialInvoice = (req, res) => {
    const { id } = req.params;
    db.run("DELETE FROM CommercialInvoices WHERE CommercialInvoiceID = ?", [id], function (err) {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Error deleting Commercial Invoice",
                error: err.message
            });
        }
        res.json({
            success: true,
            message: "Commercial Invoice deleted successfully"
        });
    });
};
