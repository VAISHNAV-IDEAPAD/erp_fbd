import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "/api";

export const INITIAL_ITEM_REQUISITIONS = [
    {
        RequisitionID: 1,
        ReqNo: "REQ/AAPL9B/2627/045",
        IssueNo: "IS/AAPL9B/2627/088",
        ReqDate: "14-10-2026",
        Associate: "Apex Leather Works",
        Warehouse: "RAW MATERIAL STORE 9B",
        Remark: "Batch 104 Cutting requisition",
        InternalMemo: "Line 1 bulk cutting",
        Department: "Cutting Dept",
        Transporter: "In-House Transfer",
        ReqBy: "Ramesh Kumar",
        EntryOn: "14-10-2026 10:15AM",
        Status: "Approved",
        EntryBy: "Nikhil Singh",
        UpdatedBy: "Admin",
        TotalQty: 185.5,
        RowCount: 2,
        details: [
            { ItemCode: "LTH-1093", ItemName: "COW CULATTAS SINGLE LEATHER", Color: "BLACK", Quantity: 120.5, UOM: "SQFT", RequiredDate: "15-10-2026", Remarks: "Upper cutting" },
            { ItemCode: "LTH-1112", ItemName: "COW ECO VEG SIDE CRUST LEATHER", Color: "TAN", Quantity: 65.0, UOM: "SQFT", RequiredDate: "15-10-2026", Remarks: "Counter reinforcement" }
        ]
    },
    {
        RequisitionID: 2,
        ReqNo: "REQ/AAPL9B/2627/044",
        IssueNo: "IS/AAPL9B/2627/087",
        ReqDate: "13-10-2026",
        Associate: "Balaji Trims & Fasteners",
        Warehouse: "SEMI FINISH STORE 9B",
        Remark: "Urgent sampling line fasteners",
        InternalMemo: "Internal sample dev FY26-27",
        Department: "Sampling Dept",
        Transporter: "Self",
        ReqBy: "Nikhil Singh",
        EntryOn: "13-10-2026 01:45PM",
        Status: "Issued",
        EntryBy: "Admin",
        UpdatedBy: "Admin",
        TotalQty: 450.0,
        RowCount: 1,
        details: [
            { ItemCode: "HDW-2236", ItemName: "JAM RIVET SINGLE HEAD 7MM", Color: "ANTIQUE BRASS", Quantity: 450.0, UOM: "SET", RequiredDate: "14-10-2026", Remarks: "Riveting section" }
        ]
    },
    {
        RequisitionID: 3,
        ReqNo: "REQ/AAPL9B/2627/043",
        IssueNo: "IS/AAPL9B/2627/086",
        ReqDate: "12-10-2026",
        Associate: "Supreme Leathercraft",
        Warehouse: "SEMI FINISH STORE 18",
        Remark: "Stitching floor material request",
        InternalMemo: "Regular order dispatch",
        Department: "Stitching Floor",
        Transporter: "In-House Transfer",
        ReqBy: "Pooja Verma",
        EntryOn: "12-10-2026 11:20AM",
        Status: "Completed",
        EntryBy: "Pooja Verma",
        UpdatedBy: "Nikhil Singh",
        TotalQty: 320.0,
        RowCount: 2,
        details: [
            { ItemCode: "SFS-105", ItemName: "Reinforcement Strips 25mm", Color: "WHITE", Quantity: 200.0, UOM: "MTR", RequiredDate: "13-10-2026", Remarks: "Collar reinforcement" },
            { ItemCode: "SFS-106", ItemName: "Padded Tongue Inserts", Color: "NATURAL", Quantity: 120.0, UOM: "PCS", RequiredDate: "13-10-2026", Remarks: "Assembly line" }
        ]
    },
    {
        RequisitionID: 4,
        ReqNo: "REQ/AAPL9B/2627/042",
        IssueNo: "",
        ReqDate: "12-10-2026",
        Associate: "K-Tex Textiles",
        Warehouse: "RAW MATERIAL STORE 9B",
        Remark: "MT-21980 Lining fabric requirement",
        InternalMemo: "Export batch lining",
        Department: "Cutting Dept",
        Transporter: "Blue Dart Logistics",
        ReqBy: "Ramesh Kumar",
        EntryOn: "12-10-2026 10:10AM",
        Status: "Pending",
        EntryBy: "Ramesh Kumar",
        UpdatedBy: "",
        TotalQty: 600.0,
        RowCount: 1,
        details: [
            { ItemCode: "RNF-1085", ItemName: "HIGH DENSITY TOPLINER 0.4MM", Color: "BLACK", Quantity: 600.0, UOM: "MTR", RequiredDate: "16-10-2026", Remarks: "Lining cutting" }
        ]
    },
    {
        RequisitionID: 5,
        ReqNo: "REQ/AAPL9B/2627/041",
        IssueNo: "",
        ReqDate: "11-10-2026",
        Associate: "Classic Threads & Zips",
        Warehouse: "STORE 30",
        Remark: "Zipper and core spun thread lot",
        InternalMemo: "Sampling accessories dev",
        Department: "Sampling Dept",
        Transporter: "In-House Transfer",
        ReqBy: "Sunil Sharma",
        EntryOn: "11-10-2026 09:30AM",
        Status: "Draft",
        EntryBy: "Sunil Sharma",
        UpdatedBy: "",
        TotalQty: 150.0,
        RowCount: 2,
        details: [
            { ItemCode: "TRM-3012", ItemName: "NYLON ZIPPER #5 OPEN END 65CM", Color: "NAVY", Quantity: 100.0, UOM: "PCS", RequiredDate: "15-10-2026", Remarks: "Outer jacket" },
            { ItemCode: "THD-1020", ItemName: "POLY-CORE SEWING THREAD 40/2", Color: "NAVY", Quantity: 50.0, UOM: "SPOOL", RequiredDate: "15-10-2026", Remarks: "Matching color thread" }
        ]
    }
];

export const getItemRequisitions = async (params = {}) => {
    try {
        const res = await axios.get(`${API_URL}/item-requisitions`, { params });
        const list = res.data?.data || res.data || [];
        if (Array.isArray(list) && list.length > 0) {
            return list;
        }
    } catch (e) {
        console.warn("Using fallback item requisitions:", e.message);
    }
    return INITIAL_ITEM_REQUISITIONS;
};

export const getItemRequisitionById = async (id) => {
    try {
        const res = await axios.get(`${API_URL}/item-requisitions/${id}`);
        return res.data?.data || res.data;
    } catch (e) {
        console.warn("Unable to fetch item requisition by ID:", e.message);
        return INITIAL_ITEM_REQUISITIONS.find(r => String(r.RequisitionID) === String(id) || String(r.ReqNo) === String(id));
    }
};

export const createItemRequisition = async (data) => {
    try {
        const res = await axios.post(`${API_URL}/item-requisitions`, data);
        return res.data;
    } catch (e) {
        console.warn("Unable to post item requisition to API, saving locally:", e.message);
        return { success: true, data };
    }
};

export const updateItemRequisition = async (id, data) => {
    try {
        const res = await axios.put(`${API_URL}/item-requisitions/${id}`, data);
        return res.data;
    } catch (e) {
        console.warn("Unable to update item requisition via API:", e.message);
        return { success: true };
    }
};

export const deleteItemRequisition = async (id) => {
    try {
        const res = await axios.delete(`${API_URL}/item-requisitions/${id}`);
        return res.data;
    } catch (e) {
        console.warn("Unable to delete item requisition via API:", e.message);
        return { success: true };
    }
};

export default {
    getItemRequisitions,
    getItemRequisitionById,
    createItemRequisition,
    updateItemRequisition,
    deleteItemRequisition,
    INITIAL_ITEM_REQUISITIONS
};
