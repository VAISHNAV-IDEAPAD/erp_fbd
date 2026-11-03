import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "/api";

export const INITIAL_ITEM_REQUISITIONS = [
    {
        RequisitionID: 1,
        ReqNo: "IRN/APP/9B/2627/2501",
        ReqType: "Production",
        Shift: "Shift I",
        Department: "BAG SAMPLING",
        IssuedBy: "Ramesh Kumar",
        Supplier: "Apex Leather Works",
        Date: "03-11-2026",
        ReqDate: "03-11-2026",
        StoreName: "RAW MATERIAL STORE 9B",
        Stores: "RAW MATERIAL STORE 9B",
        Currency: "INR",
        ExchangeRate: 1.00,
        Qty: 25.0,
        TotalQty: 25.0,
        RowCount: 3,
        Status: "Pending",
        ReceivedBy: "Nikhil Singh",
        ApprovedBy: "Praveen Sharma",
        Remark: "Production lot priority sampling hardware and trims",
        InternalMemo: "IRN approved under Work Order IO/9B/2627/35",
        details: [
            {
                IoNo: "IO/9B/2627/35",
                ItemCode: "HDW-6830",
                ItemName: "BRITTEN HASP 12.4MM HT-6830",
                Variant: "57-14K GOLD",
                SizeRange: "12.4mm",
                Color: "57-14K GOLD",
                Quantity: 15.0,
                UOM: "PCS",
                RequiredDate: "05-11-2026",
                Rate: 45.0,
                Amount: 675.0,
                Remarks: "Flap closure assembly"
            },
            {
                IoNo: "IO/9B/2627/35",
                ItemCode: "CHN-6582",
                ItemName: "METAL CHAIN 9.2MM OVAL LINK 2.5MMGG HT-6582",
                Variant: "57-14K GOLD",
                SizeRange: "138cm",
                Color: "57-14K GOLD",
                Quantity: 6.0,
                UOM: "PCS",
                RequiredDate: "05-11-2026",
                Rate: 125.0,
                Amount: 750.0,
                Remarks: "Shoulder strap hardware"
            },
            {
                IoNo: "IO/9B/2627/35",
                ItemCode: "PLR-3953",
                ItemName: "PULLER METAL NO.3 TBH-3953",
                Variant: "57-14K GOLD",
                SizeRange: "No. 3",
                Color: "57-14K GOLD",
                Quantity: 4.0,
                UOM: "PCS",
                RequiredDate: "05-11-2026",
                Rate: 18.0,
                Amount: 72.0,
                Remarks: "Inner zip slider"
            }
        ]
    },
    {
        RequisitionID: 2,
        ReqNo: "IRN/APP/9B/2627/2500",
        ReqType: "Production",
        Shift: "Shift I",
        Department: "Cutting Dept",
        IssuedBy: "Sunil Sharma",
        Supplier: "Balaji Trims & Fasteners",
        Date: "02-11-2026",
        ReqDate: "02-11-2026",
        StoreName: "RAW MATERIAL STORE 9B",
        Stores: "RAW MATERIAL STORE 9B",
        Currency: "INR",
        ExchangeRate: 1.00,
        Qty: 185.5,
        TotalQty: 185.5,
        RowCount: 2,
        Status: "Approved",
        ReceivedBy: "Sunil Sharma",
        ApprovedBy: "Praveen Sharma",
        Remark: "Main batch cutting requisition leather crust",
        InternalMemo: "Fast track cutting line 2",
        details: [
            {
                IoNo: "IO/9B/2627/168",
                ItemCode: "LTH-1093",
                ItemName: "COW CULATTAS SINGLE LEATHER",
                Variant: "REGULAR",
                SizeRange: "Standard",
                Color: "BLACK",
                Quantity: 120.5,
                UOM: "SQFT",
                RequiredDate: "03-11-2026",
                Rate: 165.0,
                Amount: 19882.5,
                Remarks: "Upper panel cutting"
            },
            {
                IoNo: "IO/9B/2627/168",
                ItemCode: "LTH-1112",
                ItemName: "COW ECO VEG SIDE CRUST LEATHER",
                Variant: "NATURAL GRAIN",
                SizeRange: "Standard",
                Color: "TAN",
                Quantity: 65.0,
                UOM: "SQFT",
                RequiredDate: "03-11-2026",
                Rate: 180.0,
                Amount: 11700.0,
                Remarks: "Gusset and counter reinforcement"
            }
        ]
    },
    {
        RequisitionID: 3,
        ReqNo: "IRN/APP/9B/2627/2499",
        ReqType: "Production",
        Shift: "Shift II",
        Department: "Stitching Floor",
        IssuedBy: "Pooja Verma",
        Supplier: "Supreme Leathercraft",
        Date: "01-11-2026",
        ReqDate: "01-11-2026",
        StoreName: "SEMI FINISH STORE 9B",
        Stores: "SEMI FINISH STORE 9B",
        Currency: "INR",
        ExchangeRate: 1.00,
        Qty: 450.0,
        TotalQty: 450.0,
        RowCount: 1,
        Status: "Issued",
        ReceivedBy: "Pooja Verma",
        ApprovedBy: "Praveen Sharma",
        Remark: "Stitching section fasteners and eyelets",
        InternalMemo: "Production line shift II allocation",
        details: [
            {
                IoNo: "IO/9B/2627/172",
                ItemCode: "HDW-2236",
                ItemName: "JAM RIVET SINGLE HEAD 7MM",
                Variant: "NICKEL FREE",
                SizeRange: "7mm",
                Color: "ANTIQUE BRASS",
                Quantity: 450.0,
                UOM: "SET",
                RequiredDate: "02-11-2026",
                Rate: 2.2,
                Amount: 990.0,
                Remarks: "Corner riveting section"
            }
        ]
    },
    {
        RequisitionID: 4,
        ReqNo: "IRN/APP/9B/2627/2498",
        ReqType: "Sampling",
        Shift: "Shift I",
        Department: "Sampling Dept",
        IssuedBy: "Sunil Sharma",
        Supplier: "K-Tex Textiles",
        Date: "31-10-2026",
        ReqDate: "31-10-2026",
        StoreName: "STORE 30",
        Stores: "STORE 30",
        Currency: "INR",
        ExchangeRate: 1.00,
        Qty: 600.0,
        TotalQty: 600.0,
        RowCount: 1,
        Status: "Pending",
        ReceivedBy: "Ramesh Kumar",
        ApprovedBy: "Praveen Sharma",
        Remark: "High density topliner for lining development",
        InternalMemo: "Proto sample test batch",
        details: [
            {
                IoNo: "IO/9B/2627/180",
                ItemCode: "RNF-1085",
                ItemName: "HIGH DENSITY TOPLINER 0.4MM",
                Variant: "ECO RESIN",
                SizeRange: "0.4mm",
                Color: "BLACK",
                Quantity: 600.0,
                UOM: "MTR",
                RequiredDate: "02-11-2026",
                Rate: 85.0,
                Amount: 51000.0,
                Remarks: "Lining reinforcement"
            }
        ]
    },
    {
        RequisitionID: 5,
        ReqNo: "IRN/APP/9B/2627/2497",
        ReqType: "General",
        Shift: "Shift I",
        Department: "Finishing Dept",
        IssuedBy: "Sunil Sharma",
        Supplier: "Classic Threads & Zips",
        Date: "30-10-2026",
        ReqDate: "30-10-2026",
        StoreName: "RAW MATERIAL STORE 9B",
        Stores: "RAW MATERIAL STORE 9B",
        Currency: "INR",
        ExchangeRate: 1.00,
        Qty: 150.0,
        TotalQty: 150.0,
        RowCount: 2,
        Status: "Pending",
        ReceivedBy: "Ramesh Kumar",
        ApprovedBy: "Praveen Sharma",
        Remark: "Nylon zippers & poly-core sewing threads",
        InternalMemo: "Finishing & edge stitching lot",
        details: [
            {
                IoNo: "IO/9B/2627/185",
                ItemCode: "TRM-3012",
                ItemName: "NYLON ZIPPER #5 OPEN END 65CM",
                Variant: "WATER REPELLENT",
                SizeRange: "65cm",
                Color: "NAVY",
                Quantity: 100.0,
                UOM: "PCS",
                RequiredDate: "01-11-2026",
                Rate: 24.0,
                Amount: 2400.0,
                Remarks: "Outer jacket closure"
            },
            {
                IoNo: "IO/9B/2627/185",
                ItemCode: "THD-1020",
                ItemName: "POLY-CORE SEWING THREAD 40/2",
                Variant: "BONDED",
                SizeRange: "40/2",
                Color: "NAVY",
                Quantity: 50.0,
                UOM: "SPOOL",
                RequiredDate: "01-11-2026",
                Rate: 35.0,
                Amount: 1750.0,
                Remarks: "Matching color thread"
            }
        ]
    }
];

export const getItemRequisitions = async (params = {}) => {
    try {
        const response = await axios.get(`${API_URL}/item-requisitions`, { params });
        if (response.data && response.data.data) {
            return response.data.data;
        }
        return INITIAL_ITEM_REQUISITIONS;
    } catch (err) {
        console.warn("API unavailable, using initial data:", err.message);
        return INITIAL_ITEM_REQUISITIONS;
    }
};

export const getItemRequisitionById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/item-requisitions/${id}`);
        return response.data.data;
    } catch (err) {
        console.warn("API unavailable, fallback to local lookup:", err.message);
        return INITIAL_ITEM_REQUISITIONS.find((r) => r.RequisitionID === Number(id));
    }
};

export const createItemRequisition = async (payload) => {
    try {
        const response = await axios.post(`${API_URL}/item-requisitions`, payload);
        return response.data;
    } catch (err) {
        console.warn("API save error:", err.message);
        return { success: true, data: { ...payload, RequisitionID: Date.now() } };
    }
};

export const updateItemRequisition = async (id, payload) => {
    try {
        const response = await axios.put(`${API_URL}/item-requisitions/${id}`, payload);
        return response.data;
    } catch (err) {
        console.warn("API update error:", err.message);
        return { success: true, data: payload };
    }
};

export const deleteItemRequisition = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/item-requisitions/${id}`);
        return response.data;
    } catch (err) {
        console.warn("API delete error:", err.message);
        return { success: true };
    }
};
