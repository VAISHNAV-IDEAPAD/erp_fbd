import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || "/api";

// Initial Demo/Fallback Bins for Plot No. 9B
const DEFAULT_BINS = [
    { BinID: 1, BinCode: "BIN-A-01-01", WarehouseName: "RAW MATERIAL STORE 9B", Zone: "Zone A - Leather", Rack: "Rack A1", Shelf: "Level 1", BinType: "Pallet Bin", MaxCapacity: 500, CurrentQty: 250, UOM: "SQFT", Status: "Partially Filled", Barcode: "BAR-BIN-A0101", Remarks: "Upper leather storage" },
    { BinID: 2, BinCode: "BIN-A-01-02", WarehouseName: "RAW MATERIAL STORE 9B", Zone: "Zone A - Leather", Rack: "Rack A1", Shelf: "Level 2", BinType: "Pallet Bin", MaxCapacity: 500, CurrentQty: 0, UOM: "SQFT", Status: "Available", Barcode: "BAR-BIN-A0102", Remarks: "Upper leather top shelf" },
    { BinID: 3, BinCode: "BIN-A-02-01", WarehouseName: "RAW MATERIAL STORE 9B", Zone: "Zone A - Leather", Rack: "Rack A2", Shelf: "Level 1", BinType: "Pallet Bin", MaxCapacity: 600, CurrentQty: 280, UOM: "SQFT", Status: "Partially Filled", Barcode: "BAR-BIN-A0201", Remarks: "Crust & lining leather" },
    { BinID: 4, BinCode: "BIN-B-01-01", WarehouseName: "RAW MATERIAL STORE 9B", Zone: "Zone B - Fabric & Lining", Rack: "Rack B1", Shelf: "Level 1", BinType: "Roll Bin", MaxCapacity: 1200, CurrentQty: 850, UOM: "MTR", Status: "Partially Filled", Barcode: "BAR-BIN-B0101", Remarks: "Cotton twill rolls" },
    { BinID: 5, BinCode: "BIN-B-01-02", WarehouseName: "RAW MATERIAL STORE 9B", Zone: "Zone B - Fabric & Lining", Rack: "Rack B1", Shelf: "Level 2", BinType: "Roll Bin", MaxCapacity: 1000, CurrentQty: 600, UOM: "MTR", Status: "Partially Filled", Barcode: "BAR-BIN-B0102", Remarks: "Interlining & fused fabrics" },
    { BinID: 6, BinCode: "BIN-B-02-01", WarehouseName: "RAW MATERIAL STORE 9B", Zone: "Zone B - Fabric & Lining", Rack: "Rack B2", Shelf: "Level 1", BinType: "Roll Bin", MaxCapacity: 1500, CurrentQty: 0, UOM: "MTR", Status: "Available", Barcode: "BAR-BIN-B0201", Remarks: "Empty fabric rack" },
    { BinID: 7, BinCode: "BIN-C-01-01", WarehouseName: "ACCESSORIES GODOWN 18", Zone: "Zone C - Hardware", Rack: "Rack C1", Shelf: "Level 1", BinType: "Shelf Bin", MaxCapacity: 10000, CurrentQty: 5000, UOM: "SET", Status: "Partially Filled", Barcode: "BAR-BIN-C0101", Remarks: "Rivets, eyelets & studs" },
    { BinID: 8, BinCode: "BIN-C-01-02", WarehouseName: "ACCESSORIES GODOWN 18", Zone: "Zone C - Hardware", Rack: "Rack C1", Shelf: "Level 2", BinType: "Shelf Bin", MaxCapacity: 3000, CurrentQty: 1500, UOM: "PCS", Status: "Partially Filled", Barcode: "BAR-BIN-C0102", Remarks: "YKK metallic zippers" },
    { BinID: 9, BinCode: "BIN-D-01-01", WarehouseName: "RAW MATERIAL STORE 9B", Zone: "Zone D - Thread & Trims", Rack: "Rack D1", Shelf: "Level 1", BinType: "Shelf Bin", MaxCapacity: 500, CurrentQty: 120, UOM: "CONE", Status: "Partially Filled", Barcode: "BAR-BIN-D0101", Remarks: "Bonded nylon threads" }
];

// Initial Demo Roll / Serials
const DEFAULT_ROLLS = [
    { RollID: 1, RollSerialNo: "RL-2627-1001", ItemCode: "LTH-1093", ItemName: "COW CULATTAS SINGLE LEATHER", LotNo: "LOT-9B-2026-A", Shade: "BLACK", LengthQty: 150, UOM: "SQFT", BinCode: "BIN-A-01-01", Barcode: "BAR-RL-1001", Status: "Allocated", RefDocNo: "GRN-2026-081", GeneratedDate: "2026-10-22", CreatedBy: "Tilak" },
    { RollID: 2, RollSerialNo: "RL-2627-1002", ItemCode: "LTH-1093", ItemName: "COW CULATTAS SINGLE LEATHER", LotNo: "LOT-9B-2026-A", Shade: "BLACK", LengthQty: 100, UOM: "SQFT", BinCode: "BIN-A-01-01", Barcode: "BAR-RL-1002", Status: "Allocated", RefDocNo: "GRN-2026-081", GeneratedDate: "2026-10-22", CreatedBy: "Tilak" },
    { RollID: 3, RollSerialNo: "RL-2627-1003", ItemCode: "LTH-1112", ItemName: "COW ECO VEG SIDE CRUST LEATHER", LotNo: "LOT-9B-2026-B", Shade: "TAN", LengthQty: 280, UOM: "SQFT", BinCode: "BIN-A-02-01", Barcode: "BAR-RL-1003", Status: "Allocated", RefDocNo: "GRN-2026-083", GeneratedDate: "2026-10-23", CreatedBy: "Tilak" },
    { RollID: 4, RollSerialNo: "RL-2627-2001", ItemCode: "FAB-3011", ItemName: "COTTON TWILL LINING 120 GSM", LotNo: "LOT-FAB-441", Shade: "WHITE", LengthQty: 450, UOM: "MTR", BinCode: "BIN-B-01-01", Barcode: "BAR-RL-2001", Status: "Allocated", RefDocNo: "GRN-2026-085", GeneratedDate: "2026-10-24", CreatedBy: "Suresh" },
    { RollID: 5, RollSerialNo: "RL-2627-2002", ItemCode: "FAB-3011", ItemName: "COTTON TWILL LINING 120 GSM", LotNo: "LOT-FAB-441", Shade: "WHITE", LengthQty: 400, UOM: "MTR", BinCode: "BIN-B-01-01", Barcode: "BAR-RL-2002", Status: "Allocated", RefDocNo: "GRN-2026-085", GeneratedDate: "2026-10-24", CreatedBy: "Suresh" },
    { RollID: 6, RollSerialNo: "RL-2627-2003", ItemCode: "RNF-1085", ItemName: "HIGH DENSITY TOPLINER 0.4MM", LotNo: "LOT-RNF-09", Shade: "BLACK", LengthQty: 600, UOM: "MTR", BinCode: "BIN-B-01-02", Barcode: "BAR-RL-2003", Status: "Allocated", RefDocNo: "GRN-2026-086", GeneratedDate: "2026-10-24", CreatedBy: "Suresh" }
];

// Initial Demo Allocations
const DEFAULT_ALLOCATIONS = [
    {
        AllocationID: 1,
        AllocationNo: "BA/9B/2627/001",
        AllocationDate: "2026-10-22",
        WarehouseName: "RAW MATERIAL STORE 9B",
        RefType: "Item Receipt (GRN)",
        RefDocNo: "GRN-2026-081",
        TotalQty: 250,
        TotalItems: 2,
        AllocatedBy: "Tilak",
        Status: "Completed",
        Remarks: "Allocated cow leather rolls to Zone A rack 1",
        items: [
            { AllocationItemID: 1, AllocationNo: "BA/9B/2627/001", ItemCode: "LTH-1093", ItemName: "COW CULATTAS SINGLE LEATHER", RollSerialNo: "RL-2627-1001", BinCode: "BIN-A-01-01", AllocatedQty: 150, UOM: "SQFT", LotNo: "LOT-9B-2026-A", Remarks: "First cut batch" },
            { AllocationItemID: 2, AllocationNo: "BA/9B/2627/001", ItemCode: "LTH-1093", ItemName: "COW CULATTAS SINGLE LEATHER", RollSerialNo: "RL-2627-1002", BinCode: "BIN-A-01-01", AllocatedQty: 100, UOM: "SQFT", LotNo: "LOT-9B-2026-A", Remarks: "Second roll batch" }
        ]
    },
    {
        AllocationID: 2,
        AllocationNo: "BA/9B/2627/002",
        AllocationDate: "2026-10-24",
        WarehouseName: "RAW MATERIAL STORE 9B",
        RefType: "Item Receipt (GRN)",
        RefDocNo: "GRN-2026-085",
        TotalQty: 850,
        TotalItems: 2,
        AllocatedBy: "Suresh",
        Status: "Completed",
        Remarks: "Cotton twill rolls put-away to Bin B-01-01",
        items: [
            { AllocationItemID: 3, AllocationNo: "BA/9B/2627/002", ItemCode: "FAB-3011", ItemName: "COTTON TWILL LINING 120 GSM", RollSerialNo: "RL-2627-2001", BinCode: "BIN-B-01-01", AllocatedQty: 450, UOM: "MTR", LotNo: "LOT-FAB-441", Remarks: "Primary roll" },
            { AllocationItemID: 4, AllocationNo: "BA/9B/2627/002", ItemCode: "FAB-3011", ItemName: "COTTON TWILL LINING 120 GSM", RollSerialNo: "RL-2627-2002", BinCode: "BIN-B-01-01", AllocatedQty: 400, UOM: "MTR", LotNo: "LOT-FAB-441", Remarks: "Secondary roll" }
        ]
    }
];

// Initial Demo Issues
const DEFAULT_ISSUES = [
    {
        IssueID: 1,
        IssueNo: "BI/9B/2627/001",
        IssueDate: "2026-10-24",
        WarehouseName: "RAW MATERIAL STORE 9B",
        IssueReason: "Cutting Slip",
        RefDocNo: "CS/2627/098",
        IssuedToDepartment: "Cutting Floor Line 1",
        TotalQty: 50,
        TotalRows: 1,
        IssuedBy: "Tilak",
        Status: "Completed",
        Remarks: "Picked for batch sample cut",
        items: [
            { IssueItemID: 1, IssueNo: "BI/9B/2627/001", ItemCode: "FAB-3011", ItemName: "COTTON TWILL LINING 120 GSM", BinCode: "BIN-B-01-01", RollSerialNo: "RL-2627-2001", PickQty: 50, UOM: "MTR", Remarks: "Sample cutting" }
        ]
    }
];


const normalizeBin = (b) => ({
    BinID: b.BinID ?? b.binid ?? Date.now(),
    BinCode: b.BinCode ?? b.bincode ?? "",
    WarehouseName: b.WarehouseName ?? b.warehousename ?? "RAW MATERIAL STORE 9B",
    Zone: b.Zone ?? b.zone ?? "",
    Rack: b.Rack ?? b.rack ?? "",
    Shelf: b.Shelf ?? b.shelf ?? "",
    BinType: b.BinType ?? b.bintype ?? "Roll Bin",
    MaxCapacity: parseFloat(b.MaxCapacity ?? b.maxcapacity ?? 500) || 500,
    CurrentQty: parseFloat(b.CurrentQty ?? b.currentqty ?? 0) || 0,
    UOM: b.UOM ?? b.uom ?? "MTR",
    Status: b.Status ?? b.status ?? "Available",
    Barcode: b.Barcode ?? b.barcode ?? "",
    Remarks: b.Remarks ?? b.remarks ?? ""
});

const normalizeRoll = (r) => ({
    RollID: r.RollID ?? r.rollid ?? Date.now(),
    RollSerialNo: r.RollSerialNo ?? r.rollserialno ?? "",
    ItemCode: r.ItemCode ?? r.itemcode ?? "",
    ItemName: r.ItemName ?? r.itemname ?? "",
    LotNo: r.LotNo ?? r.lotno ?? "",
    Shade: r.Shade ?? r.shade ?? "",
    LengthQty: parseFloat(r.LengthQty ?? r.lengthqty ?? 0) || 0,
    UOM: r.UOM ?? r.uom ?? "MTR",
    BinCode: r.BinCode ?? r.bincode ?? "",
    Barcode: r.Barcode ?? r.barcode ?? "",
    Status: r.Status ?? r.status ?? "In Stock",
    RefDocNo: r.RefDocNo ?? r.refdocno ?? "",
    GeneratedDate: r.GeneratedDate ?? r.generateddate ?? "",
    CreatedBy: r.CreatedBy ?? r.createdby ?? "Store Incharge"
});

const normalizeAllocation = (a) => ({
    AllocationID: a.AllocationID ?? a.allocationid ?? Date.now(),
    AllocationNo: a.AllocationNo ?? a.allocationno ?? "",
    AllocationDate: a.AllocationDate ?? a.allocationdate ?? "",
    WarehouseName: a.WarehouseName ?? a.warehousename ?? "RAW MATERIAL STORE 9B",
    RefType: a.RefType ?? a.reftype ?? "Item Receipt (GRN)",
    RefDocNo: a.RefDocNo ?? a.refdocno ?? "",
    TotalQty: parseFloat(a.TotalQty ?? a.totalqty ?? 0) || 0,
    TotalItems: parseInt(a.TotalItems ?? a.totalitems ?? 0, 10) || 0,
    AllocatedBy: a.AllocatedBy ?? a.allocatedby ?? "Store Incharge",
    Status: a.Status ?? a.status ?? "Completed",
    Remarks: a.Remarks ?? a.remarks ?? "",
    items: (a.items || []).map((it) => ({
        AllocationItemID: it.AllocationItemID ?? it.allocationitemid ?? Date.now(),
        AllocationNo: it.AllocationNo ?? it.allocationno ?? "",
        ItemCode: it.ItemCode ?? it.itemcode ?? "",
        ItemName: it.ItemName ?? it.itemname ?? "",
        RollSerialNo: it.RollSerialNo ?? it.rollserialno ?? "",
        BinCode: it.BinCode ?? it.bincode ?? "",
        AllocatedQty: parseFloat(it.AllocatedQty ?? it.allocatedqty ?? 0) || 0,
        UOM: it.UOM ?? it.uom ?? "MTR",
        LotNo: it.LotNo ?? it.lotno ?? "",
        Remarks: it.Remarks ?? it.remarks ?? ""
    }))
});

const normalizeIssue = (iss) => ({
    IssueID: iss.IssueID ?? iss.issueid ?? Date.now(),
    IssueNo: iss.IssueNo ?? iss.issueno ?? "",
    IssueDate: iss.IssueDate ?? iss.issuedate ?? "",
    WarehouseName: iss.WarehouseName ?? iss.warehousename ?? "RAW MATERIAL STORE 9B",
    IssueReason: iss.IssueReason ?? iss.issuereason ?? "Cutting Slip",
    RefDocNo: iss.RefDocNo ?? iss.refdocno ?? "",
    IssuedToDepartment: iss.IssuedToDepartment ?? iss.issuedtodepartment ?? "",
    TotalQty: parseFloat(iss.TotalQty ?? iss.totalqty ?? 0) || 0,
    TotalRows: parseInt(iss.TotalRows ?? iss.totalrows ?? 0, 10) || 0,
    IssuedBy: iss.IssuedBy ?? iss.issuedby ?? "Store Incharge",
    Status: iss.Status ?? iss.status ?? "Completed",
    Remarks: iss.Remarks ?? iss.remarks ?? "",
    items: (iss.items || []).map((it) => ({
        IssueItemID: it.IssueItemID ?? it.issueitemid ?? Date.now(),
        IssueNo: it.IssueNo ?? it.issueno ?? "",
        ItemCode: it.ItemCode ?? it.itemcode ?? "",
        ItemName: it.ItemName ?? it.itemname ?? "",
        BinCode: it.BinCode ?? it.bincode ?? "",
        RollSerialNo: it.RollSerialNo ?? it.rollserialno ?? "",
        PickQty: parseFloat(it.PickQty ?? it.pickqty ?? 0) || 0,
        UOM: it.UOM ?? it.uom ?? "MTR",
        Remarks: it.Remarks ?? it.remarks ?? ""
    }))
});

export const wmsService = {
    // --------------------------------------------------
    // BINS
    // --------------------------------------------------
    async getBins(params = {}) {
        try {
            const res = await axios.get(`${API_BASE}/wms/bins`, { params });
            const list = res.data?.data || res.data || [];
            if (Array.isArray(list) && list.length > 0) return list.map(normalizeBin);
        } catch (e) {
            console.warn("WMS Bins API offline, falling back to local state");
        }

        const saved = localStorage.getItem("erp_wms_bins");
        if (saved) {
            try { return JSON.parse(saved); } catch (_) {}
        }
        localStorage.setItem("erp_wms_bins", JSON.stringify(DEFAULT_BINS));
        return DEFAULT_BINS;
    },

    async createBin(binData) {
        try {
            const res = await axios.post(`${API_BASE}/wms/bins`, binData);
            if (res.data?.success) return res.data.data;
        } catch (e) {
            console.warn("WMS createBin API offline, saving locally");
        }

        const bins = await this.getBins();
        const newBin = {
            ...binData,
            BinID: Date.now(),
            Barcode: binData.Barcode || `BAR-${binData.BinCode.replace(/[^A-Za-z0-9]/g, "")}`,
            Status: binData.Status || "Available",
            CurrentQty: parseFloat(binData.CurrentQty) || 0
        };
        const updated = [...bins, newBin];
        localStorage.setItem("erp_wms_bins", JSON.stringify(updated));
        return newBin;
    },

    async updateBin(id, binData) {
        try {
            await axios.put(`${API_BASE}/wms/bins/${id}`, binData);
        } catch (e) {
            console.warn("WMS updateBin API offline, updating locally");
        }

        const bins = await this.getBins();
        const updated = bins.map(b => (b.BinID === Number(id) || b.BinCode === binData.BinCode ? { ...b, ...binData } : b));
        localStorage.setItem("erp_wms_bins", JSON.stringify(updated));
        return true;
    },

    async deleteBin(id) {
        try {
            await axios.delete(`${API_BASE}/wms/bins/${id}`);
        } catch (e) {}

        const bins = await this.getBins();
        const updated = bins.filter(b => b.BinID !== Number(id));
        localStorage.setItem("erp_wms_bins", JSON.stringify(updated));
        return true;
    },

    // --------------------------------------------------
    // ROLL & SERIAL GENERATION
    // --------------------------------------------------
    async getRollSerials(params = {}) {
        try {
            const res = await axios.get(`${API_BASE}/wms/roll-serials`, { params });
            const list = res.data?.data || res.data || [];
            if (Array.isArray(list) && list.length > 0) return list.map(normalizeRoll);
        } catch (e) {
            console.warn("WMS RollSerials API offline, using local state");
        }

        const saved = localStorage.getItem("erp_wms_rolls");
        if (saved) {
            try { return JSON.parse(saved); } catch (_) {}
        }
        localStorage.setItem("erp_wms_rolls", JSON.stringify(DEFAULT_ROLLS));
        return DEFAULT_ROLLS;
    },

    async generateRollSerials(payload) {
        try {
            const res = await axios.post(`${API_BASE}/wms/roll-serials/generate`, payload);
            if (res.data?.success) return res.data.data;
        } catch (e) {
            console.warn("WMS generateRollSerials API offline, generating locally");
        }

        const existing = await this.getRollSerials();
        const newRolls = [];
        const prefix = payload.Prefix || "RL-2627-";
        const start = parseInt(payload.StartIndex, 10) || (1000 + existing.length + 1);
        const count = parseInt(payload.QuantityCount, 10) || 1;
        const dateStr = new Date().toISOString().split("T")[0];

        if (Array.isArray(payload.CustomRolls) && payload.CustomRolls.length > 0) {
            payload.CustomRolls.forEach((r, idx) => {
                const rollNo = r.RollSerialNo || `${prefix}${String(start + idx).padStart(4, "0")}`;
                newRolls.push({
                    RollID: Date.now() + idx,
                    RollSerialNo: rollNo,
                    ItemCode: payload.ItemCode,
                    ItemName: payload.ItemName,
                    LotNo: r.LotNo || payload.LotNo,
                    Shade: r.Shade || payload.Shade,
                    LengthQty: parseFloat(r.LengthQty || payload.StandardLength) || 50,
                    UOM: payload.UOM || "MTR",
                    BinCode: r.BinCode || "",
                    Barcode: `BAR-${rollNo.replace(/[^A-Za-z0-9]/g, "")}`,
                    Status: "In Stock",
                    RefDocNo: payload.RefDocNo || "",
                    GeneratedDate: dateStr,
                    CreatedBy: payload.CreatedBy || "Store Incharge"
                });
            });
        } else {
            for (let i = 0; i < count; i++) {
                const rollNo = `${prefix}${String(start + i).padStart(4, "0")}`;
                newRolls.push({
                    RollID: Date.now() + i,
                    RollSerialNo: rollNo,
                    ItemCode: payload.ItemCode,
                    ItemName: payload.ItemName,
                    LotNo: payload.LotNo || "",
                    Shade: payload.Shade || "",
                    LengthQty: parseFloat(payload.StandardLength) || 50,
                    UOM: payload.UOM || "MTR",
                    BinCode: "",
                    Barcode: `BAR-${rollNo.replace(/[^A-Za-z0-9]/g, "")}`,
                    Status: "In Stock",
                    RefDocNo: payload.RefDocNo || "",
                    GeneratedDate: dateStr,
                    CreatedBy: payload.CreatedBy || "Store Incharge"
                });
            }
        }

        const updated = [...newRolls, ...existing];
        localStorage.setItem("erp_wms_rolls", JSON.stringify(updated));
        return newRolls;
    },

    // --------------------------------------------------
    // BIN ALLOCATIONS
    // --------------------------------------------------
    async getAllocations() {
        try {
            const res = await axios.get(`${API_BASE}/wms/allocations`);
            const list = res.data?.data || res.data || [];
            if (Array.isArray(list) && list.length > 0) return list.map(normalizeAllocation);
        } catch (e) {
            console.warn("WMS Allocations API offline, using local state");
        }

        const saved = localStorage.getItem("erp_wms_allocations");
        if (saved) {
            try { return JSON.parse(saved); } catch (_) {}
        }
        localStorage.setItem("erp_wms_allocations", JSON.stringify(DEFAULT_ALLOCATIONS));
        return DEFAULT_ALLOCATIONS;
    },

    async createAllocation(payload) {
        try {
            const res = await axios.post(`${API_BASE}/wms/allocations`, payload);
            if (res.data?.success) return res.data.data;
        } catch (e) {
            console.warn("WMS createAllocation API offline, persisting locally");
        }

        const allocations = await this.getAllocations();
        const allocNo = payload.AllocationNo || `BA/9B/2627/${String(Date.now()).slice(-4)}`;
        const totalQty = (payload.items || []).reduce((acc, i) => acc + (parseFloat(i.AllocatedQty) || 0), 0);

        const newAlloc = {
            AllocationID: Date.now(),
            AllocationNo: allocNo,
            AllocationDate: payload.AllocationDate || new Date().toISOString().split("T")[0],
            WarehouseName: payload.WarehouseName || "RAW MATERIAL STORE 9B",
            RefType: payload.RefType || "Item Receipt (GRN)",
            RefDocNo: payload.RefDocNo || "",
            TotalQty: totalQty,
            TotalItems: (payload.items || []).length,
            AllocatedBy: payload.AllocatedBy || "Store Incharge",
            Status: "Completed",
            Remarks: payload.Remarks || "",
            items: payload.items || []
        };

        const updated = [newAlloc, ...allocations];
        localStorage.setItem("erp_wms_allocations", JSON.stringify(updated));

        // Update local bins occupancy
        const bins = await this.getBins();
        payload.items?.forEach(it => {
            const targetBin = bins.find(b => b.BinCode === it.BinCode);
            if (targetBin) {
                targetBin.CurrentQty = (parseFloat(targetBin.CurrentQty) || 0) + (parseFloat(it.AllocatedQty) || 0);
                targetBin.Status = targetBin.CurrentQty >= targetBin.MaxCapacity ? "Full" : "Partially Filled";
            }
        });
        localStorage.setItem("erp_wms_bins", JSON.stringify(bins));

        return newAlloc;
    },

    // --------------------------------------------------
    // ISSUE FROM BIN
    // --------------------------------------------------
    async getBinIssues() {
        try {
            const res = await axios.get(`${API_BASE}/wms/issues`);
            const list = res.data?.data || res.data || [];
            if (Array.isArray(list) && list.length > 0) return list.map(normalizeIssue);
        } catch (e) {
            console.warn("WMS BinIssues API offline, using local state");
        }

        const saved = localStorage.getItem("erp_wms_issues");
        if (saved) {
            try { return JSON.parse(saved); } catch (_) {}
        }
        localStorage.setItem("erp_wms_issues", JSON.stringify(DEFAULT_ISSUES));
        return DEFAULT_ISSUES;
    },

    async createBinIssue(payload) {
        try {
            const res = await axios.post(`${API_BASE}/wms/issues`, payload);
            if (res.data?.success) return res.data.data;
        } catch (e) {
            console.warn("WMS createBinIssue API offline, persisting locally");
        }

        const issues = await this.getBinIssues();
        const issNo = payload.IssueNo || `BI/9B/2627/${String(Date.now()).slice(-4)}`;
        const totalQty = (payload.items || []).reduce((acc, i) => acc + (parseFloat(i.PickQty) || 0), 0);

        const newIssue = {
            IssueID: Date.now(),
            IssueNo: issNo,
            IssueDate: payload.IssueDate || new Date().toISOString().split("T")[0],
            WarehouseName: payload.WarehouseName || "RAW MATERIAL STORE 9B",
            IssueReason: payload.IssueReason || "Cutting Slip",
            RefDocNo: payload.RefDocNo || "",
            IssuedToDepartment: payload.IssuedToDepartment || "Cutting Floor Line 1",
            TotalQty: totalQty,
            TotalRows: (payload.items || []).length,
            IssuedBy: payload.IssuedBy || "Store Incharge",
            Status: "Completed",
            Remarks: payload.Remarks || "",
            items: payload.items || []
        };

        const updated = [newIssue, ...issues];
        localStorage.setItem("erp_wms_issues", JSON.stringify(updated));

        // Deduct from local bins
        const bins = await this.getBins();
        payload.items?.forEach(it => {
            const targetBin = bins.find(b => b.BinCode === it.BinCode);
            if (targetBin) {
                targetBin.CurrentQty = Math.max(0, (parseFloat(targetBin.CurrentQty) || 0) - (parseFloat(it.PickQty) || 0));
                targetBin.Status = targetBin.CurrentQty <= 0 ? "Available" : "Partially Filled";
            }
        });
        localStorage.setItem("erp_wms_bins", JSON.stringify(bins));

        return newIssue;
    },

    // --------------------------------------------------
    // STOCK IMPORT
    // --------------------------------------------------
    async importStock(payload) {
        try {
            const res = await axios.post(`${API_BASE}/wms/import`, payload);
            if (res.data?.success) return res.data;
        } catch (e) {
            console.warn("WMS importStock API offline, processing locally");
        }

        // Process locally
        const bins = await this.getBins();
        const rolls = await this.getRollSerials();
        const records = payload.records || [];
        let valid = 0;

        records.forEach((r, idx) => {
            const binCode = (r.BinCode || "").trim();
            const itemCode = (r.ItemCode || "").trim();
            const qty = parseFloat(r.Qty || 0);

            if (binCode && itemCode) {
                valid++;
                let existingBin = bins.find(b => b.BinCode === binCode);
                if (existingBin) {
                    existingBin.CurrentQty = (parseFloat(existingBin.CurrentQty) || 0) + qty;
                    existingBin.Status = existingBin.CurrentQty >= existingBin.MaxCapacity ? "Full" : "Partially Filled";
                } else {
                    bins.push({
                        BinID: Date.now() + idx,
                        BinCode: binCode,
                        WarehouseName: payload.WarehouseName || "RAW MATERIAL STORE 9B",
                        Zone: "Zone B - Imported",
                        Rack: "Rack 01",
                        Shelf: "Level 1",
                        BinType: "Roll Bin",
                        MaxCapacity: 1000,
                        CurrentQty: qty,
                        UOM: r.UOM || "MTR",
                        Status: "Partially Filled",
                        Barcode: `BAR-${binCode.replace(/[^A-Za-z0-9]/g, "")}`
                    });
                }

                if (r.RollSerialNo) {
                    rolls.unshift({
                        RollID: Date.now() + idx,
                        RollSerialNo: r.RollSerialNo,
                        ItemCode: itemCode,
                        ItemName: r.ItemName || itemCode,
                        LotNo: r.LotNo || "IMPORT",
                        LengthQty: qty,
                        UOM: r.UOM || "MTR",
                        BinCode: binCode,
                        Barcode: `BAR-${r.RollSerialNo.replace(/[^A-Za-z0-9]/g, "")}`,
                        Status: "Allocated",
                        GeneratedDate: new Date().toISOString().split("T")[0],
                        CreatedBy: payload.ImportedBy || "Store Incharge"
                    });
                }
            }
        });

        localStorage.setItem("erp_wms_bins", JSON.stringify(bins));
        localStorage.setItem("erp_wms_rolls", JSON.stringify(rolls));

        const history = JSON.parse(localStorage.getItem("erp_wms_import_history") || "[]");
        history.unshift({
            id: Date.now(),
            date: new Date().toISOString().split("T")[0],
            warehouse: payload.WarehouseName || "RAW MATERIAL STORE 9B",
            type: payload.ImportType || "Bin Opening Balance",
            fileName: payload.FileName || "ManualImport.csv",
            totalRows: records.length,
            validRows: valid,
            status: "Success"
        });
        localStorage.setItem("erp_wms_import_history", JSON.stringify(history));

        return { success: true, message: `Successfully imported ${valid} of ${records.length} items`, data: { totalRows: records.length, validRows: valid } };
    },

    getImportHistory() {
        return JSON.parse(localStorage.getItem("erp_wms_import_history") || "[]");
    },

    // --------------------------------------------------
    // QR / BARCODE LOOKUP
    // --------------------------------------------------
    async lookupCode(query) {
        try {
            const res = await axios.get(`${API_BASE}/wms/lookup/${encodeURIComponent(query)}`);
            if (res.data?.success) return res.data;
        } catch (e) {}

        const q = query.trim().toLowerCase();
        const bins = await this.getBins();
        const matchBin = bins.find(b => b.BinCode.toLowerCase().includes(q) || (b.Barcode && b.Barcode.toLowerCase().includes(q)));
        if (matchBin) return { success: true, type: "bin", data: matchBin };

        const rolls = await this.getRollSerials();
        const matchRoll = rolls.find(r => r.RollSerialNo.toLowerCase().includes(q) || (r.Barcode && r.Barcode.toLowerCase().includes(q)));
        if (matchRoll) return { success: true, type: "roll", data: matchRoll };

        const allocs = await this.getAllocations();
        const matchAlloc = allocs.find(a => a.AllocationNo.toLowerCase().includes(q) || (a.RefDocNo && a.RefDocNo.toLowerCase().includes(q)));
        if (matchAlloc) return { success: true, type: "allocation", data: matchAlloc };

        return { success: false, message: `No WMS records found matching '${query}'` };
    }
};

export default wmsService;
