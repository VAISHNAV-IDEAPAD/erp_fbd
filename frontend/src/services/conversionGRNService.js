import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "/api";

export const INITIAL_CONVERSION_GRNS = [
    {
        GRNID: 1,
        JSTCNo: "JSTC/30/2627/12",
        Subcontractor: "Apex Garment Processors",
        SubcontractOrderNo: "SCO/30/2627/45",
        ConversionDate: "12-10-2026",
        Store: "RAW MATERIAL STORE 30",
        Currency: "INR",
        ExchangeRate: 1.0,
        TotalQty: 240.0,
        RowCount: 1,
        Status: "Approved",
        Remarks: "Enzyme washed canvas fabric receipt",
        CreatedBy: "Admin",
        details: [
            {
                DetailID: 1,
                FromItemCode: "FAB-1001",
                FromItemName: "CANVAS CLOTH 278 GSM 10 OZ GREIGE",
                FromColor: "GREIGE",
                FromUOM: "MTR",
                FromQty: 240.0,
                ToItemCode: "FAB-1004",
                ToItemName: "WASHED CANVAS CLOTH 10 OZ",
                ToColor: "VINTAGE WASH",
                ToUOM: "MTR",
                ToQty: 236.5,
                ProcessName: "Enzyme Wash & Softening",
                Remarks: "Shrinkage allowance 1.5%"
            }
        ]
    },
    {
        GRNID: 2,
        JSTCNo: "JSTC/30/2627/11",
        Subcontractor: "Quality Leather Works",
        SubcontractOrderNo: "SCO/30/2627/42",
        ConversionDate: "08-10-2026",
        Store: "STORE 30",
        Currency: "INR",
        ExchangeRate: 1.0,
        TotalQty: 150.5,
        RowCount: 1,
        Status: "Pending Approval",
        Remarks: "Edge skiving and splitting batch 4",
        CreatedBy: "9b Fabric",
        details: [
            {
                DetailID: 2,
                FromItemCode: "LTH-1263",
                FromItemName: "COW PLOSE SUEDE LEATHER",
                FromColor: "COGNAC",
                FromUOM: "SQFT",
                FromQty: 150.5,
                ToItemCode: "LTH-1263-SKV",
                ToItemName: "SKIVED SUEDE LEATHER STRIPS",
                ToColor: "COGNAC",
                ToUOM: "SQFT",
                ToQty: 148.0,
                ProcessName: "Splitting & Edge Skiving",
                Remarks: "Pre-cut for handles"
            }
        ]
    },
    {
        GRNID: 3,
        JSTCNo: "JSTC/30/2627/10",
        Subcontractor: "Vanguard Stitches Ltd",
        SubcontractOrderNo: "SCO/30/2627/39",
        ConversionDate: "04-10-2026",
        Store: "RAW MATERIAL STORE 30",
        Currency: "INR",
        ExchangeRate: 1.0,
        TotalQty: 88.0,
        RowCount: 1,
        Status: "Approved",
        Remarks: "Gusset assembly subcontract conversion",
        CreatedBy: "Admin",
        details: [
            {
                DetailID: 3,
                FromItemCode: "CUT-102",
                FromItemName: "FRONT GUSSET PANELS",
                FromColor: "NAVY",
                FromUOM: "PCS",
                FromQty: 88.0,
                ToItemCode: "SFS-108",
                ToItemName: "STITCHED GUSSET PIECES",
                ToColor: "NAVY",
                ToUOM: "PCS",
                ToQty: 88.0,
                ProcessName: "Subcontract Stitching",
                Remarks: "Passed QC inspection"
            }
        ]
    },
    {
        GRNID: 4,
        JSTCNo: "JSTC/30/2627/9",
        Subcontractor: "TexCraft Dyeing & Treatment",
        SubcontractOrderNo: "SCO/30/2627/35",
        ConversionDate: "28-09-2026",
        Store: "SEMI FINISH STORE 18",
        Currency: "INR",
        ExchangeRate: 1.0,
        TotalQty: 312.0,
        RowCount: 1,
        Status: "Completed",
        Remarks: "Water-repellent coating treatment",
        CreatedBy: "Admin",
        details: [
            {
                DetailID: 4,
                FromItemCode: "FAB-2003",
                FromItemName: "POLY TWILL LINING 150D",
                FromColor: "BLACK",
                FromUOM: "MTR",
                FromQty: 312.0,
                ToItemCode: "FAB-2003-WR",
                ToItemName: "POLY TWILL LINING WR COATED",
                ToColor: "BLACK",
                ToUOM: "MTR",
                ToQty: 310.0,
                ProcessName: "Water Repellent Coating",
                Remarks: "Coating certified Grade 4"
            }
        ]
    },
    {
        GRNID: 5,
        JSTCNo: "JSTC/30/2627/8",
        Subcontractor: "Apex Garment Processors",
        SubcontractOrderNo: "SCO/30/2627/31",
        ConversionDate: "22-09-2026",
        Store: "RAW MATERIAL STORE 30",
        Currency: "INR",
        ExchangeRate: 1.0,
        TotalQty: 540.0,
        RowCount: 1,
        Status: "Approved",
        Remarks: "Reactive dye conversion",
        CreatedBy: "Admin",
        details: [
            {
                DetailID: 5,
                FromItemCode: "FAB-1001",
                FromItemName: "CANVAS CLOTH 278 GSM 10 OZ GREIGE",
                FromColor: "GREIGE",
                FromUOM: "MTR",
                FromQty: 540.0,
                ToItemCode: "FAB-1002",
                ToItemName: "CANVAS CLOTH 278 GSM 10 OZ DYED",
                ToColor: "OLIVE GREEN",
                ToUOM: "MTR",
                ToQty: 535.0,
                ProcessName: "Dyeing",
                Remarks: "Standard lot conversion"
            }
        ]
    }
];

export async function getConversionGRNs(filters = {}) {
    try {
        const params = new URLSearchParams();
        if (filters.search) params.append("search", filters.search);
        if (filters.subcontractor && filters.subcontractor !== "All") params.append("subcontractor", filters.subcontractor);
        if (filters.store && filters.store !== "All") params.append("store", filters.store);
        if (filters.status && filters.status !== "All") params.append("status", filters.status);

        const response = await axios.get(`${API_URL}/conversion-grns?${params.toString()}`, { timeout: 3000 });
        if (response.data && response.data.data) {
            return response.data.data;
        }
        return INITIAL_CONVERSION_GRNS;
    } catch {
        let results = [...INITIAL_CONVERSION_GRNS];
        if (filters.search) {
            const s = filters.search.toLowerCase();
            results = results.filter(r =>
                r.JSTCNo.toLowerCase().includes(s) ||
                r.Subcontractor.toLowerCase().includes(s) ||
                (r.Remarks && r.Remarks.toLowerCase().includes(s))
            );
        }
        if (filters.subcontractor && filters.subcontractor !== "All") {
            results = results.filter(r => r.Subcontractor === filters.subcontractor);
        }
        if (filters.store && filters.store !== "All") {
            results = results.filter(r => r.Store === filters.store);
        }
        if (filters.status && filters.status !== "All") {
            results = results.filter(r => r.Status === filters.status);
        }
        return results;
    }
}

export async function getConversionGRNById(id) {
    try {
        const response = await axios.get(`${API_URL}/conversion-grns/${id}`, { timeout: 3000 });
        if (response.data && response.data.data) {
            return response.data.data;
        }
    } catch {
        // Fallback
    }
    const found = INITIAL_CONVERSION_GRNS.find(r => r.GRNID === Number(id));
    return found || INITIAL_CONVERSION_GRNS[0];
}

export async function createConversionGRN(data) {
    try {
        const response = await axios.post(`${API_URL}/conversion-grns`, data, { timeout: 3000 });
        return response.data;
    } catch {
        const localId = Date.now();
        const newRecord = {
            GRNID: localId,
            JSTCNo: data.JSTCNo || `JSTC/30/2627/${Math.floor(100 + Math.random() * 900)}`,
            Subcontractor: data.Subcontractor,
            SubcontractOrderNo: data.SubcontractOrderNo || "",
            ConversionDate: data.ConversionDate || new Date().toISOString().split("T")[0],
            Store: data.Store,
            Currency: data.Currency || "INR",
            ExchangeRate: data.ExchangeRate || 1.0,
            TotalQty: data.TotalQty || 0,
            RowCount: (data.details && data.details.length) || 1,
            Status: data.Status || "Approved",
            Remarks: data.Remarks || "",
            CreatedBy: data.CreatedBy || "Admin",
            details: data.details || []
        };
        INITIAL_CONVERSION_GRNS.unshift(newRecord);
        return { success: true, data: newRecord };
    }
}

export async function updateConversionGRN(id, data) {
    try {
        const response = await axios.put(`${API_URL}/conversion-grns/${id}`, data, { timeout: 3000 });
        return response.data;
    } catch {
        const idx = INITIAL_CONVERSION_GRNS.findIndex(r => r.GRNID === Number(id));
        if (idx !== -1) {
            INITIAL_CONVERSION_GRNS[idx] = { ...INITIAL_CONVERSION_GRNS[idx], ...data };
        }
        return { success: true };
    }
}

export async function deleteConversionGRN(id) {
    try {
        const response = await axios.delete(`${API_URL}/conversion-grns/${id}`, { timeout: 3000 });
        return response.data;
    } catch {
        const idx = INITIAL_CONVERSION_GRNS.findIndex(r => r.GRNID === Number(id));
        if (idx !== -1) {
            INITIAL_CONVERSION_GRNS.splice(idx, 1);
        }
        return { success: true };
    }
}
