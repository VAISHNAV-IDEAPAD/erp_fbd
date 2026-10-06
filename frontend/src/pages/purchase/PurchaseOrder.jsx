import React, { useState, useEffect, useMemo } from 'react';
import {
    Container,
    Row,
    Col,
    Form,
    Button,
    Dropdown,
    Modal,
    Spinner,
    Alert,
    Badge,
    Table
} from 'react-bootstrap';
import {
    FaSyncAlt,
    FaBars,
    FaCog,
    FaBarcode,
    FaTag,
    FaFileExport,
    FaFileImport,
    FaFilter,
    FaPlus,
    FaCheck,
    FaTimes,
    FaEye,
    FaPrint,
    FaTrash,
    FaSearch
} from 'react-icons/fa';
import {
    getPurchaseOrders,
    getPurchaseOrder,
    savePurchaseOrder,
    updatePurchaseOrderStatus,
    bulkPurchaseOrderAction,
    deletePurchaseOrder,
    getSuppliers,
    getItems
} from '../../services/purchaseService';
import '../../styles/purchaseOrder.css';

export default function PurchaseOrder() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const [supplierSearch, setSupplierSearch] = useState('');
    const [materialSource, setMaterialSource] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');

    const [selectedIds, setSelectedIds] = useState([]);
    const [suppliersList, setSuppliersList] = useState([]);
    const [itemsList, setItemsList] = useState([]);

    const [showNewModal, setShowNewModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showPrintModal, setShowPrintModal] = useState(false);
    const [activePO, setActivePO] = useState(null);

    const [newPO, setNewPO] = useState({
        PONo: '',
        PODate: new Date().toISOString().split('T')[0],
        SupplierID: '',
        SupplierName: '',
        MaterialSource: 'Domestic',
        Currency: 'INR',
        ExchangeRate: 1,
        DeliverTo: 'Plot No. 9B',
        BillTo: 'ALPINE APPARELS PVT. LTD.',
        PurchaseType: 'Regular PO',
        EnteredBy: 'FahadHasan',
        Remarks: '',
        items: [
            { ItemID: '', ItemCode: '', ItemName: '', Quantity: 10, Rate: 100, Amount: 1000 }
        ]
    });

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const params = {};
            if (supplierSearch.trim()) params.supplier = supplierSearch.trim();
            if (materialSource !== 'All') params.materialSource = materialSource;
            if (statusFilter !== 'All') params.status = statusFilter;

            const res = await getPurchaseOrders(params);
            const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
            setOrders(data);
            setError('');
        } catch (err) {
            console.error('Failed to load purchase orders:', err);
            setError('Unable to fetch purchase orders. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const fetchMasters = async () => {
        try {
            const [supRes, itmRes] = await Promise.all([
                getSuppliers().catch(() => ({ data: [] })),
                getItems().catch(() => ({ data: [] }))
            ]);
            setSuppliersList(Array.isArray(supRes.data) ? supRes.data : (supRes.data?.data || []));
            setItemsList(Array.isArray(itmRes.data) ? itmRes.data : (itmRes.data?.data || []));
        } catch (err) {
            console.error('Error fetching masters:', err);
        }
    };

    useEffect(() => {
        fetchOrders();
        fetchMasters();
    }, []);

    const filteredOrders = useMemo(() => {
        return orders.filter(po => {
            const matchSupplier = !supplierSearch.trim() ||
                (po.SupplierName || '').toLowerCase().includes(supplierSearch.toLowerCase()) ||
                (po.PONo || '').toLowerCase().includes(supplierSearch.toLowerCase());

            const matchSource = materialSource === 'All' ||
                (po.MaterialSource || 'Domestic').toLowerCase() === materialSource.toLowerCase();

            const matchStatus = statusFilter === 'All' ||
                (po.ApproveTag || po.Status || '').toUpperCase() === statusFilter.toUpperCase();

            return matchSupplier && matchSource && matchStatus;
        });
    }, [orders, supplierSearch, materialSource, statusFilter]);

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedIds(filteredOrders.map(o => o.POID));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectRow = (poid) => {
        setSelectedIds(prev =>
            prev.includes(poid) ? prev.filter(id => id !== poid) : [...prev, poid]
        );
    };

    const handleStatusChange = async (poId, newTag, newStatus) => {
        try {
            await updatePurchaseOrderStatus(poId, newStatus, newTag);
            setSuccessMsg(`Purchase order status changed to ${newTag}`);
            setTimeout(() => setSuccessMsg(''), 4000);
            fetchOrders();
        } catch (err) {
            alert('Failed to update status');
        }
    };

    const handleDelete = async (poId) => {
        if (!window.confirm('Are you sure you want to delete this purchase order?')) return;
        try {
            await deletePurchaseOrder(poId);
            setSuccessMsg('Purchase order deleted successfully');
            setTimeout(() => setSuccessMsg(''), 4000);
            fetchOrders();
        } catch (err) {
            alert('Failed to delete purchase order');
        }
    };

    const handleViewDetails = async (po) => {
        try {
            const res = await getPurchaseOrder(po.POID);
            setActivePO(res.data?.data || res.data || po);
            setShowViewModal(true);
        } catch (e) {
            setActivePO(po);
            setShowViewModal(true);
        }
    };

    const handlePrintPO = async (po) => {
        try {
            const res = await getPurchaseOrder(po.POID);
            setActivePO(res.data?.data || res.data || po);
            setShowPrintModal(true);
        } catch (e) {
            setActivePO(po);
            setShowPrintModal(true);
        }
    };

    const handleBulkAction = async (action) => {
        if (selectedIds.length === 0) {
            alert('Please select at least one purchase order');
            return;
        }
        if (action === 'delete' && !window.confirm(`Delete ${selectedIds.length} selected purchase orders?`)) return;

        try {
            await bulkPurchaseOrderAction(action, selectedIds);
            setSuccessMsg(`Bulk ${action} completed successfully`);
            setTimeout(() => setSuccessMsg(''), 4000);
            setSelectedIds([]);
            fetchOrders();
        } catch (err) {
            alert(`Failed to execute bulk ${action}`);
        }
    };

    const handleExportCSV = () => {
        if (filteredOrders.length === 0) {
            alert('No data to export');
            return;
        }

        const headers = [
            'PO No', 'PO Date', 'Approve Tag', 'Supplier Name', 'Deliver To',
            'Currency', 'Purchase Type', 'Ex.Rate', 'Bill To', 'Entered By',
            'Entered On', 'Updated By', 'Updated On', 'Quantity', 'No. of rows'
        ];

        const rows = filteredOrders.map(po => [
            po.PONo,
            po.PODate,
            po.ApproveTag || 'PENDING',
            `"${(po.SupplierName || '').replace(/"/g, '""')}"`,
            po.DeliverTo || 'Plot No. 9B',
            po.Currency || 'INR',
            po.PurchaseType || 'Regular PO',
            po.ExchangeRate || 1,
            `"${(po.BillTo || '').replace(/"/g, '""')}"`,
            po.EnteredBy || '',
            po.EnteredOn || '',
            po.UpdatedBy || '',
            po.UpdatedOn || '',
            po.Quantity || 0,
            po.NoOfRows || 1
        ]);

        const csvContent = 'data:text/csv;charset=utf-8,' +
            [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `PurchaseOrders_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const openNewPOModal = () => {
        const nextSeq = orders.length + 963;
        setNewPO({
            PONo: `PO/AAPL9B/26-27/${nextSeq}`,
            PODate: new Date().toISOString().split('T')[0],
            SupplierID: suppliersList[0]?.SupplierID || '',
            SupplierName: suppliersList[0]?.SupplierName || '',
            MaterialSource: 'Domestic',
            Currency: 'INR',
            ExchangeRate: 1,
            DeliverTo: 'Plot No. 9B',
            BillTo: 'ALPINE APPARELS PVT. LTD.',
            PurchaseType: 'Regular PO',
            EnteredBy: 'FahadHasan',
            Remarks: '',
            items: [
                {
                    ItemID: itemsList[0]?.ItemID || '',
                    ItemCode: itemsList[0]?.ItemCode || 'FAB-001',
                    ItemName: itemsList[0]?.ItemName || 'Cotton Fabric',
                    Quantity: 100,
                    Rate: 96,
                    Amount: 9600
                }
            ]
        });
        setShowNewModal(true);
    };

    const handleItemChange = (idx, field, val) => {
        const updated = [...newPO.items];
        updated[idx][field] = val;

        if (field === 'ItemID') {
            const itm = itemsList.find(i => String(i.ItemID) === String(val));
            if (itm) {
                updated[idx].ItemCode = itm.ItemCode;
                updated[idx].ItemName = itm.ItemName;
                updated[idx].Rate = itm.Rate || updated[idx].Rate;
            }
        }

        if (field === 'Quantity' || field === 'Rate') {
            const q = Number(field === 'Quantity' ? val : updated[idx].Quantity) || 0;
            const r = Number(field === 'Rate' ? val : updated[idx].Rate) || 0;
            updated[idx].Amount = q * r;
        }

        setNewPO({ ...newPO, items: updated });
    };

    const addItemRow = () => {
        setNewPO({
            ...newPO,
            items: [
                ...newPO.items,
                { ItemID: '', ItemCode: '', ItemName: '', Quantity: 10, Rate: 50, Amount: 500 }
            ]
        });
    };

    const removeItemRow = (idx) => {
        if (newPO.items.length === 1) return;
        setNewPO({
            ...newPO,
            items: newPO.items.filter((_, i) => i !== idx)
        });
    };

    const handleSaveNewPO = async (submitStatus = 'PENDING') => {
        try {
            const payload = {
                ...newPO,
                ApproveTag: submitStatus,
                Status: submitStatus === 'APPROVED' ? 'Approved' : 'Open'
            };

            await savePurchaseOrder(payload);
            setShowNewModal(false);
            setSuccessMsg(`Purchase Order ${newPO.PONo} created successfully!`);
            setTimeout(() => setSuccessMsg(''), 4000);
            fetchOrders();
        } catch (err) {
            console.error(err);
            alert('Failed to save Purchase Order. Please check inputs.');
        }
    };

    const totalNewQuantity = useMemo(() => {
        return newPO.items.reduce((acc, curr) => acc + (Number(curr.Quantity) || 0), 0);
    }, [newPO.items]);

    const totalNewAmount = useMemo(() => {
        return newPO.items.reduce((acc, curr) => acc + (Number(curr.Amount) || 0), 0);
    }, [newPO.items]);

    return (
        <div className="po-workbench-container">
            <h2 className="po-page-title">Purchase Order</h2>

            {successMsg && (
                <Alert variant="success" className="py-2 px-3 mb-2 small d-flex justify-content-between align-items-center">
                    <span>{successMsg}</span>
                    <Button variant="link" className="p-0 text-success" onClick={() => setSuccessMsg('')}>✕</Button>
                </Alert>
            )}

            {error && (
                <Alert variant="danger" className="py-2 px-3 mb-2 small d-flex justify-content-between align-items-center">
                    <span>{error}</span>
                    <Button variant="link" className="p-0 text-danger" onClick={() => setError('')}>✕</Button>
                </Alert>
            )}

            <div className="po-filter-bar">
                <Row className="align-items-center g-3">
                    <Col xs={12} sm={6} md={3}>
                        <label className="po-filter-label">Supplier Name</label>
                        <div className="position-relative">
                            <Form.Control
                                type="text"
                                placeholder="Supplier Name Search..."
                                className="po-input-control pe-4"
                                value={supplierSearch}
                                onChange={(e) => setSupplierSearch(e.target.value)}
                            />
                            <FaSearch className="position-absolute top-50 end-0 translate-middle-y me-2 text-muted small" />
                        </div>
                    </Col>

                    <Col xs={12} sm={6} md={3}>
                        <label className="po-filter-label">Material Source</label>
                        <div className="po-radio-group">
                            <label className="po-radio-item">
                                <input
                                    type="radio"
                                    name="matSource"
                                    checked={materialSource === 'Domestic'}
                                    onChange={() => setMaterialSource('Domestic')}
                                />
                                Domestic
                            </label>
                            <label className="po-radio-item">
                                <input
                                    type="radio"
                                    name="matSource"
                                    checked={materialSource === 'Import'}
                                    onChange={() => setMaterialSource('Import')}
                                />
                                Import
                            </label>
                            <label className="po-radio-item">
                                <input
                                    type="radio"
                                    name="matSource"
                                    checked={materialSource === 'All'}
                                    onChange={() => setMaterialSource('All')}
                                />
                                All
                            </label>
                        </div>
                    </Col>

                    <Col xs={12} sm={6} md={3}>
                        <label className="po-filter-label">Status</label>
                        <Form.Select
                            className="po-input-control"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="All">All</option>
                            <option value="PENDING">PENDING</option>
                            <option value="APPROVED">APPROVED</option>
                            <option value="CANCELLED">CANCELLED</option>
                        </Form.Select>
                    </Col>

                    <Col xs={12} sm={6} md={3} className="text-sm-end text-start mt-auto">
                        <Button
                            className="po-btn-new"
                            onClick={openNewPOModal}
                        >
                            <FaPlus /> + New Purchase Order
                        </Button>
                    </Col>
                </Row>
            </div>

            <div className="po-toolbar-row">
                <div className="po-toolbar-left">
                    <button className="po-tool-btn" onClick={fetchOrders} title="Refresh List">
                        <FaSyncAlt />
                    </button>
                    <button className="po-tool-btn" title="List View">
                        <FaBars />
                    </button>
                    <button className="po-tool-btn" title="Column Settings">
                        <FaCog />
                    </button>
                    <button className="po-tool-btn" title="Barcode">
                        <FaBarcode />
                    </button>
                    <button className="po-tool-btn" title="Price Tag">
                        <FaTag /> Price Tag
                    </button>
                    <button className="po-tool-btn" onClick={handleExportCSV} title="Export CSV">
                        <FaFileExport />
                    </button>
                    <button className="po-tool-btn" title="Import">
                        <FaFileImport />
                    </button>
                    <button className="po-tool-btn" title="Toggle Filter" onClick={fetchOrders}>
                        <FaFilter /> Filter
                    </button>
                </div>

                <div className="po-toolbar-right">
                    <div className="po-page-indicator">1</div>
                    <Dropdown align="end">
                        <Dropdown.Toggle className="po-bulk-btn">
                            Bulk Action
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => handleBulkAction('approve')}>
                                <FaCheck className="text-success me-2" /> Bulk Approve ({selectedIds.length})
                            </Dropdown.Item>
                            <Dropdown.Item onClick={handleExportCSV}>
                                <FaFileExport className="text-primary me-2" /> Export Selected
                            </Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item onClick={() => handleBulkAction('delete')} className="text-danger">
                                <FaTrash className="me-2" /> Delete Selected ({selectedIds.length})
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </div>

            <div className="po-table-wrapper">
                {loading ? (
                    <div className="text-center py-5">
                        <Spinner animation="border" variant="primary" />
                        <div className="mt-2 text-muted small">Loading purchase orders...</div>
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="text-center py-5 text-muted">
                        <p className="mb-1">No purchase orders found matching the filter criteria.</p>
                        <Button variant="outline-primary" size="sm" onClick={openNewPOModal}>
                            + Create Purchase Order
                        </Button>
                    </div>
                ) : (
                    <table className="po-table">
                        <thead>
                            <tr>
                                <th style={{ width: '80px', textAlign: 'center' }}>Action</th>
                                <th>PO No</th>
                                <th>PO Date</th>
                                <th>Approve Tag</th>
                                <th>Supplier Name</th>
                                <th>Deliver To</th>
                                <th>Curency</th>
                                <th>Purchase Type</th>
                                <th className="text-numeric">Ex.Rate</th>
                                <th>Bill To</th>
                                <th>Entered By</th>
                                <th>Entered On</th>
                                <th>Updated By</th>
                                <th>Updated On</th>
                                <th className="text-numeric">Quantity</th>
                                <th className="text-numeric">No. of rows</th>
                                <th style={{ width: '32px', textAlign: 'center' }}>
                                    <input
                                        type="checkbox"
                                        className="po-checkbox"
                                        onChange={handleSelectAll}
                                        checked={selectedIds.length === filteredOrders.length && filteredOrders.length > 0}
                                    />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map((po) => {
                                const isSelected = selectedIds.includes(po.POID);
                                const tagUpper = (po.ApproveTag || po.Status || 'PENDING').toUpperCase();

                                return (
                                    <tr key={po.POID} className={isSelected ? 'selected' : ''}>
                                        <td style={{ textAlign: 'center' }}>
                                            <Dropdown>
                                                <Dropdown.Toggle className="po-action-dropdown-btn">
                                                    Action
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu className="small shadow-sm">
                                                    <Dropdown.Item onClick={() => handleViewDetails(po)}>
                                                        <FaEye className="me-2 text-primary" /> View Details
                                                    </Dropdown.Item>
                                                    <Dropdown.Item onClick={() => handlePrintPO(po)}>
                                                        <FaPrint className="me-2 text-secondary" /> Print PO
                                                    </Dropdown.Item>
                                                    <Dropdown.Divider />
                                                    {tagUpper !== 'APPROVED' && (
                                                        <Dropdown.Item onClick={() => handleStatusChange(po.POID, 'APPROVED', 'Approved')}>
                                                            <FaCheck className="me-2 text-success" /> Approve
                                                        </Dropdown.Item>
                                                    )}
                                                    {tagUpper !== 'CANCELLED' && (
                                                        <Dropdown.Item onClick={() => handleStatusChange(po.POID, 'CANCELLED', 'Cancelled')}>
                                                            <FaTimes className="me-2 text-warning" /> Cancel PO
                                                        </Dropdown.Item>
                                                    )}
                                                    <Dropdown.Divider />
                                                    <Dropdown.Item onClick={() => handleDelete(po.POID)} className="text-danger">
                                                        <FaTrash className="me-2" /> Delete
                                                    </Dropdown.Item>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </td>
                                        <td className="fw-semibold text-primary" style={{ cursor: 'pointer' }} onClick={() => handleViewDetails(po)}>
                                            {po.PONo || po.PONumber}
                                        </td>
                                        <td>{po.PODate}</td>
                                        <td>
                                            <span className={
                                                tagUpper === 'APPROVED' ? 'po-tag-approved' :
                                                tagUpper === 'CANCELLED' ? 'po-tag-cancelled' :
                                                'po-tag-pending'
                                            }>
                                                {tagUpper}
                                            </span>
                                        </td>
                                        <td className="fw-semibold">{po.SupplierName}</td>
                                        <td>{po.DeliverTo || 'Plot No. 9B'}</td>
                                        <td>{po.Currency || po.Curency || 'INR'}</td>
                                        <td>{po.PurchaseType || 'Regular PO'}</td>
                                        <td className="text-numeric">{po.ExchangeRate || po.ExRate || 1}</td>
                                        <td>{po.BillTo || 'ALPINE APPARELS PVT. LTD.'}</td>
                                        <td>{po.EnteredBy || 'Admin'}</td>
                                        <td>{po.EnteredOn || '-'}</td>
                                        <td>{po.UpdatedBy || ''}</td>
                                        <td>{po.UpdatedOn || ''}</td>
                                        <td className="text-numeric fw-bold">{po.Quantity}</td>
                                        <td className="text-numeric">{po.NoOfRows || 1}</td>
                                        <td style={{ textAlign: 'center' }}>
                                            <input
                                                type="checkbox"
                                                className="po-checkbox"
                                                checked={isSelected}
                                                onChange={() => handleSelectRow(po.POID)}
                                            />
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>

            {/* MODAL: NEW PURCHASE ORDER */}
            <Modal show={showNewModal} onHide={() => setShowNewModal(false)} size="xl" centered backdrop="static">
                <Modal.Header closeButton className="po-modal-header">
                    <Modal.Title className="fs-6 fw-bold">Create New Purchase Order</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4">
                    <Row className="g-3 mb-4">
                        <Col md={3}>
                            <Form.Label className="po-filter-label">PO Number</Form.Label>
                            <Form.Control
                                type="text"
                                className="po-input-control fw-bold text-primary"
                                value={newPO.PONo}
                                onChange={(e) => setNewPO({ ...newPO, PONo: e.target.value })}
                            />
                        </Col>
                        <Col md={3}>
                            <Form.Label className="po-filter-label">PO Date</Form.Label>
                            <Form.Control
                                type="date"
                                className="po-input-control"
                                value={newPO.PODate}
                                onChange={(e) => setNewPO({ ...newPO, PODate: e.target.value })}
                            />
                        </Col>
                        <Col md={3}>
                            <Form.Label className="po-filter-label">Supplier</Form.Label>
                            <Form.Select
                                className="po-input-control"
                                value={newPO.SupplierID}
                                onChange={(e) => {
                                    const s = suppliersList.find(sup => String(sup.SupplierID) === String(e.target.value));
                                    setNewPO({
                                        ...newPO,
                                        SupplierID: e.target.value,
                                        SupplierName: s ? s.SupplierName : newPO.SupplierName
                                    });
                                }}
                            >
                                <option value="">Select Supplier...</option>
                                {suppliersList.map(s => (
                                    <option key={s.SupplierID} value={s.SupplierID}>
                                        {s.SupplierName}
                                    </option>
                                ))}
                            </Form.Select>
                        </Col>
                        <Col md={3}>
                            <Form.Label className="po-filter-label">Material Source</Form.Label>
                            <Form.Select
                                className="po-input-control"
                                value={newPO.MaterialSource}
                                onChange={(e) => setNewPO({ ...newPO, MaterialSource: e.target.value })}
                            >
                                <option value="Domestic">Domestic</option>
                                <option value="Import">Import</option>
                            </Form.Select>
                        </Col>

                        <Col md={3}>
                            <Form.Label className="po-filter-label">Currency</Form.Label>
                            <Form.Select
                                className="po-input-control"
                                value={newPO.Currency}
                                onChange={(e) => {
                                    const curr = e.target.value;
                                    const rate = curr === 'USD' ? 96 : curr === 'EURO' ? 104 : curr === 'GBP' ? 122 : 1;
                                    setNewPO({ ...newPO, Currency: curr, ExchangeRate: rate });
                                }}
                            >
                                <option value="INR">INR (₹)</option>
                                <option value="USD">USD ($)</option>
                                <option value="EURO">EURO (€)</option>
                                <option value="GBP">GBP (£)</option>
                            </Form.Select>
                        </Col>
                        <Col md={3}>
                            <Form.Label className="po-filter-label">Exchange Rate</Form.Label>
                            <Form.Control
                                type="number"
                                className="po-input-control"
                                value={newPO.ExchangeRate}
                                onChange={(e) => setNewPO({ ...newPO, ExchangeRate: Number(e.target.value) || 1 })}
                            />
                        </Col>
                        <Col md={3}>
                            <Form.Label className="po-filter-label">Deliver To</Form.Label>
                            <Form.Control
                                type="text"
                                className="po-input-control"
                                value={newPO.DeliverTo}
                                onChange={(e) => setNewPO({ ...newPO, DeliverTo: e.target.value })}
                            />
                        </Col>
                        <Col md={3}>
                            <Form.Label className="po-filter-label">Bill To</Form.Label>
                            <Form.Control
                                type="text"
                                className="po-input-control"
                                value={newPO.BillTo}
                                onChange={(e) => setNewPO({ ...newPO, BillTo: e.target.value })}
                            />
                        </Col>
                    </Row>

                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <h6 className="mb-0 fw-bold text-secondary small text-uppercase">Order Line Items</h6>
                        <Button variant="outline-primary" size="sm" onClick={addItemRow}>
                            <FaPlus className="me-1" /> Add Item
                        </Button>
                    </div>

                    <div className="table-responsive border rounded mb-3">
                        <table className="table table-sm po-items-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Item Selection</th>
                                    <th>Item Code</th>
                                    <th className="text-numeric">Quantity</th>
                                    <th className="text-numeric">Rate ({newPO.Currency})</th>
                                    <th className="text-numeric">Amount</th>
                                    <th style={{ width: '40px' }}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {newPO.items.map((item, idx) => (
                                    <tr key={idx}>
                                        <td className="text-muted">{idx + 1}</td>
                                        <td>
                                            <Form.Select
                                                size="sm"
                                                value={item.ItemID}
                                                onChange={(e) => handleItemChange(idx, 'ItemID', e.target.value)}
                                            >
                                                <option value="">Select Item...</option>
                                                {itemsList.map(it => (
                                                    <option key={it.ItemID} value={it.ItemID}>
                                                        {it.ItemName} ({it.ItemCode})
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </td>
                                        <td>
                                            <Form.Control
                                                size="sm"
                                                readOnly
                                                value={item.ItemCode}
                                                placeholder="Item Code"
                                            />
                                        </td>
                                        <td>
                                            <Form.Control
                                                type="number"
                                                size="sm"
                                                className="text-end"
                                                value={item.Quantity}
                                                onChange={(e) => handleItemChange(idx, 'Quantity', e.target.value)}
                                            />
                                        </td>
                                        <td>
                                            <Form.Control
                                                type="number"
                                                size="sm"
                                                className="text-end"
                                                value={item.Rate}
                                                onChange={(e) => handleItemChange(idx, 'Rate', e.target.value)}
                                            />
                                        </td>
                                        <td className="text-numeric fw-bold text-primary">
                                            {(Number(item.Amount) || 0).toLocaleString()}
                                        </td>
                                        <td className="text-center">
                                            <Button
                                                variant="link"
                                                className="text-danger p-0"
                                                onClick={() => removeItemRow(idx)}
                                                disabled={newPO.items.length === 1}
                                            >
                                                <FaTrash />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <Row className="justify-content-end">
                        <Col md={4}>
                            <div className="bg-light p-3 rounded border text-end">
                                <div className="d-flex justify-content-between mb-1 small">
                                    <span>Total Line Items:</span>
                                    <span className="fw-bold">{newPO.items.length}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-1 small">
                                    <span>Total Quantity:</span>
                                    <span className="fw-bold">{totalNewQuantity}</span>
                                </div>
                                <div className="d-flex justify-content-between fs-6 fw-bold text-primary pt-2 border-top">
                                    <span>Grand Total ({newPO.Currency}):</span>
                                    <span>{totalNewAmount.toLocaleString()}</span>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer className="bg-light py-2 px-4">
                    <Button variant="secondary" size="sm" onClick={() => setShowNewModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="outline-primary" size="sm" onClick={() => handleSaveNewPO('PENDING')}>
                        Save as Pending
                    </Button>
                    <Button variant="success" size="sm" onClick={() => handleSaveNewPO('APPROVED')}>
                        Save & Approve
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* MODAL: VIEW DETAILS */}
            <Modal show={showViewModal} onHide={() => setShowViewModal(false)} size="lg" centered>
                <Modal.Header closeButton className="po-modal-header">
                    <Modal.Title className="fs-6 fw-bold">
                        Purchase Order Details — {activePO?.PONo || activePO?.PONumber}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4">
                    {activePO && (
                        <>
                            <Row className="g-3 mb-4 bg-light p-3 rounded border small">
                                <Col md={4}>
                                    <div className="text-muted">Supplier:</div>
                                    <div className="fw-bold">{activePO.SupplierName}</div>
                                </Col>
                                <Col md={4}>
                                    <div className="text-muted">PO Date:</div>
                                    <div className="fw-bold">{activePO.PODate}</div>
                                </Col>
                                <Col md={4}>
                                    <div className="text-muted">Status:</div>
                                    <div>
                                        <Badge bg={
                                            (activePO.ApproveTag || activePO.Status) === 'APPROVED' ? 'success' :
                                            (activePO.ApproveTag || activePO.Status) === 'CANCELLED' ? 'danger' : 'warning'
                                        }>
                                            {activePO.ApproveTag || activePO.Status || 'PENDING'}
                                        </Badge>
                                    </div>
                                </Col>
                                <Col md={4}>
                                    <div className="text-muted">Deliver To:</div>
                                    <div>{activePO.DeliverTo || 'Plot No. 9B'}</div>
                                </Col>
                                <Col md={4}>
                                    <div className="text-muted">Bill To:</div>
                                    <div>{activePO.BillTo || 'ALPINE APPARELS PVT. LTD.'}</div>
                                </Col>
                                <Col md={4}>
                                    <div className="text-muted">Currency & Rate:</div>
                                    <div>{activePO.Currency} (Ex.Rate: {activePO.ExchangeRate || 1})</div>
                                </Col>
                            </Row>

                            <h6 className="fw-bold small text-muted text-uppercase mb-2">Line Items</h6>
                            <Table hover responsive className="table-sm small border">
                                <thead className="table-light">
                                    <tr>
                                        <th>Item Code</th>
                                        <th>Item Name</th>
                                        <th className="text-numeric">Quantity</th>
                                        <th className="text-numeric">Rate</th>
                                        <th className="text-numeric">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(activePO.items && activePO.items.length > 0) ? (
                                        activePO.items.map((it, idx) => (
                                            <tr key={idx}>
                                                <td><code>{it.ItemCode}</code></td>
                                                <td>{it.ItemName}</td>
                                                <td className="text-numeric fw-bold">{it.Quantity}</td>
                                                <td className="text-numeric">{it.Rate}</td>
                                                <td className="text-numeric">{(it.Amount || (it.Quantity * it.Rate)).toLocaleString()}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td><code>FAB-001</code></td>
                                            <td>Garment Material Line Item</td>
                                            <td className="text-numeric fw-bold">{activePO.Quantity}</td>
                                            <td className="text-numeric">{activePO.ExchangeRate || 96}</td>
                                            <td className="text-numeric">{(activePO.TotalAmount || (activePO.Quantity * 96)).toLocaleString()}</td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer className="bg-light py-2">
                    <Button variant="secondary" size="sm" onClick={() => setShowViewModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" size="sm" onClick={() => { setShowViewModal(false); handlePrintPO(activePO); }}>
                        <FaPrint className="me-1" /> Print Preview
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* MODAL: PRINT PREVIEW */}
            <Modal show={showPrintModal} onHide={() => setShowPrintModal(false)} size="lg" centered>
                <Modal.Header closeButton className="po-modal-header">
                    <Modal.Title className="fs-6 fw-bold">Purchase Order Voucher</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4" id="po-print-area">
                    {activePO && (
                        <div className="p-3 border rounded bg-white font-monospace">
                            <div className="text-center border-bottom pb-3 mb-3">
                                <h4 className="fw-bold text-primary mb-1">ALPINE APPARELS PVT. LTD.</h4>
                                <div className="small text-muted">Plot No. 9B, Industrial Apparel Zone, Okhla / Faridabad</div>
                                <div className="small text-muted">GSTIN: 07AAACA1234A1Z5 | Email: purchase@alpineapparels.com</div>
                                <h5 className="fw-bold mt-2 text-dark">PURCHASE ORDER</h5>
                            </div>

                            <Row className="mb-3 small">
                                <Col xs={6}>
                                    <div><strong>PO No:</strong> {activePO.PONo || activePO.PONumber}</div>
                                    <div><strong>PO Date:</strong> {activePO.PODate}</div>
                                    <div><strong>Currency:</strong> {activePO.Currency} (Ex.Rate: {activePO.ExchangeRate || 1})</div>
                                    <div><strong>Type:</strong> {activePO.PurchaseType || 'Regular PO'}</div>
                                </Col>
                                <Col xs={6} className="text-end">
                                    <div><strong>Supplier:</strong> {activePO.SupplierName}</div>
                                    <div><strong>Deliver To:</strong> {activePO.DeliverTo || 'Plot No. 9B'}</div>
                                    <div><strong>Status:</strong> {activePO.ApproveTag || activePO.Status}</div>
                                    <div><strong>Entered By:</strong> {activePO.EnteredBy || 'Admin'}</div>
                                </Col>
                            </Row>

                            <Table bordered size="sm" className="small mb-3">
                                <thead className="table-light">
                                    <tr>
                                        <th>#</th>
                                        <th>Item Description</th>
                                        <th className="text-end">Quantity</th>
                                        <th className="text-end">Rate</th>
                                        <th className="text-end">Total Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(activePO.items && activePO.items.length > 0) ? (
                                        activePO.items.map((it, idx) => (
                                            <tr key={idx}>
                                                <td>{idx + 1}</td>
                                                <td>{it.ItemName} ({it.ItemCode})</td>
                                                <td className="text-end">{it.Quantity}</td>
                                                <td className="text-end">{it.Rate}</td>
                                                <td className="text-end">{(it.Amount || (it.Quantity * it.Rate)).toLocaleString()}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td>1</td>
                                            <td>Order Line Items Batch</td>
                                            <td className="text-end">{activePO.Quantity}</td>
                                            <td className="text-end">{activePO.ExchangeRate || 96}</td>
                                            <td className="text-end">{(activePO.TotalAmount || (activePO.Quantity * 96)).toLocaleString()}</td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>

                            <Row className="mt-4 pt-4 border-top text-center small text-muted">
                                <Col xs={4}>
                                    <div>_______________________</div>
                                    <div>Prepared By</div>
                                </Col>
                                <Col xs={4}>
                                    <div>_______________________</div>
                                    <div>Verified By</div>
                                </Col>
                                <Col xs={4}>
                                    <div>_______________________</div>
                                    <div>Authorized Signatory</div>
                                </Col>
                            </Row>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer className="bg-light py-2">
                    <Button variant="secondary" size="sm" onClick={() => setShowPrintModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" size="sm" onClick={() => window.print()}>
                        <FaPrint className="me-1" /> Print Now
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
