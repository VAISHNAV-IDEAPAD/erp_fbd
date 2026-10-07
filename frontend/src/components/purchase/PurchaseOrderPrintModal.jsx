import React, { useState } from 'react';
import { Modal, Button, Table, Badge, Row, Col, Form, InputGroup } from 'react-bootstrap';
import { FaPrint, FaSearch, FaArrowLeft, FaBuilding, FaMapMarkerAlt, FaFileInvoiceDollar } from 'react-icons/fa';

export default function PurchaseOrderPrintModal({ show, onHide, poData, allOrders = [], onSelectPO, onDeletePO }) {
  const [activeView, setActiveView] = useState('detail');
  const [searchTerm, setSearchTerm] = useState('');

  const currentPO = poData;

  const handlePrint = () => {
    window.print();
  };

  const filteredOrders = (allOrders || []).filter(po => {
    const term = searchTerm.toLowerCase();
    const poNo = (po.PONo || po.PONumber || '').toLowerCase();
    const sup = (po.SupplierName || '').toLowerCase();
    return poNo.includes(term) || sup.includes(term);
  });

  return (
    <Modal show={show} onHide={onHide} size="xl" fullscreen="lg-down" backdrop="static">
      <Modal.Header closeButton className="bg-light">
        <div className="d-flex align-items-center gap-2">
          <FaFileInvoiceDollar className="text-primary fs-4" />
          <Modal.Title className="fs-5 fw-bold mb-0">
            {activeView === 'detail' && currentPO
              ? `Purchase Order Voucher: ${currentPO.PONo || currentPO.PONumber}`
              : 'Purchase Orders Register'}
          </Modal.Title>
        </div>
        <div className="ms-auto me-3 d-flex gap-2">
          {activeView === 'detail' ? (
            <>
              {allOrders.length > 0 && (
                <Button variant="outline-secondary" size="sm" onClick={() => setActiveView('list')}>
                  <FaSearch className="me-1" /> Browse All Orders ({allOrders.length})
                </Button>
              )}
              <Button variant="primary" size="sm" onClick={handlePrint}>
                <FaPrint className="me-1" /> Print PO
              </Button>
            </>
          ) : (
            currentPO && (
              <Button variant="outline-primary" size="sm" onClick={() => setActiveView('detail')}>
                <FaArrowLeft className="me-1" /> Back to Current PO
              </Button>
            )
          )}
        </div>
      </Modal.Header>

      <Modal.Body className="p-4">
        <style>{`
          @media print {
            body * { visibility: hidden; }
            .po-print-area, .po-print-area * { visibility: visible; }
            .po-print-area { position: absolute; left: 0; top: 0; width: 100%; margin: 0; padding: 20px; }
            .modal-header, .modal-footer, .no-print { display: none !important; }
          }
          .po-box { border: 1px solid #cbd5e1; border-radius: 6px; padding: 12px; background: #fafbfc; height: 100%; }
          .po-title-banner { background: #1565c0; color: white; padding: 8px 16px; border-radius: 4px; font-weight: 700; letter-spacing: 0.5px; }
          .po-table th { background: #1565c0 !important; color: white !important; font-size: 12px; }
          .po-table td { font-size: 13px; }
        `}</style>

        {activeView === 'list' ? (
          <div>
            <Row className="mb-3">
              <Col md={6}>
                <InputGroup>
                  <InputGroup.Text><FaSearch /></InputGroup.Text>
                  <Form.Control
                    placeholder="Search by PO Number, Supplier..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
              </Col>
              <Col md={6} className="text-end text-muted align-self-center">
                Found {filteredOrders.length} Purchase Order(s)
              </Col>
            </Row>

            <Table responsive hover bordered size="sm">
              <thead className="table-primary">
                <tr>
                  <th>PO No</th>
                  <th>PO Date</th>
                  <th>Supplier</th>
                  <th>Purchase Type</th>
                  <th>Items</th>
                  <th>Linked Indents</th>
                  <th className="text-end">Sub Total</th>
                  <th className="text-end">Net Amount</th>
                  <th>Status</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((po) => (
                    <tr key={po.POID} style={{ cursor: 'pointer' }}>
                      <td className="fw-bold text-primary" onClick={() => { onSelectPO(po.POID); setActiveView('detail'); }}>
                        {po.PONo || po.PONumber}
                      </td>
                      <td>{po.PODate || '-'}</td>
                      <td>{po.SupplierName || '-'}</td>
                      <td><Badge bg="secondary">{po.PurchaseType || 'Domestic'}</Badge></td>
                      <td className="text-center">{po.TotalItems || '-'}</td>
                      <td>
                        <span className="small text-muted">{po.LinkedIndents || 'Direct PO'}</span>
                      </td>
                      <td className="text-end">₹{Number(po.SubTotal || po.TotalAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                      <td className="text-end fw-bold text-success">₹{Number(po.NetAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                      <td><Badge bg="success">{po.Status || 'Open'}</Badge></td>
                      <td className="text-center">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="py-0 px-2 me-1"
                          onClick={() => { onSelectPO(po.POID); setActiveView('detail'); }}
                        >
                          View
                        </Button>
                        {onDeletePO && (
                          <Button
                            variant="outline-danger"
                            size="sm"
                            className="py-0 px-2"
                            onClick={() => onDeletePO(po.POID)}
                          >
                            ×
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={10} className="text-center py-4 text-muted">
                      No Purchase Orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        ) : currentPO ? (
          <div className="po-print-area">
            {/* VOUCHER HEADER */}
            <div className="border-bottom pb-3 mb-3 d-flex justify-content-between align-items-start">
              <div>
                <h4 className="fw-bold text-primary mb-1 d-flex align-items-center gap-2">
                  <FaBuilding /> ALPINE APPARELS PVT. LTD.
                </h4>
                <div className="text-muted small">
                  PLOT NO. 9B, SECTOR-27A, FARIDABAD, HARYANA - 121003<br />
                  GSTIN: 06AAACA9876F1Z8 | Phone: +91 129 4009900 | Email: purchase@alpineapparels.com
                </div>
              </div>
              <div className="text-end">
                <div className="po-title-banner mb-2 text-center">
                  PURCHASE ORDER
                </div>
                <div className="fw-bold text-dark fs-5">{currentPO.PONo || currentPO.PONumber}</div>
                <div className="small text-muted">
                  <strong>Date:</strong> {currentPO.PODate || new Date().toISOString().slice(0, 10)}
                </div>
              </div>
            </div>

            {/* SUPPLIER & SHIP TO INFORMATION */}
            <Row className="g-3 mb-3">
              <Col md={6}>
                <div className="po-box">
                  <div className="fw-bold text-primary mb-1 border-bottom pb-1">
                    VENDOR / SUPPLIER
                  </div>
                  <div className="fw-bold fs-6 text-dark">{currentPO.SupplierName || 'Supplier'}</div>
                  <div className="small text-muted">
                    {currentPO.SupplierAddress && <div>{currentPO.SupplierAddress}</div>}
                    {currentPO.SupplierGST && <div><strong>GSTIN:</strong> {currentPO.SupplierGST}</div>}
                    {currentPO.SupplierPhone && <div><strong>Phone:</strong> {currentPO.SupplierPhone}</div>}
                    {currentPO.SupplierEmail && <div><strong>Email:</strong> {currentPO.SupplierEmail}</div>}
                  </div>
                </div>
              </Col>
              <Col md={6}>
                <div className="po-box">
                  <div className="fw-bold text-primary mb-1 border-bottom pb-1 d-flex justify-content-between">
                    <span>SHIP TO / DELIVERY DESTINATION</span>
                    <FaMapMarkerAlt />
                  </div>
                  <pre className="small text-dark mb-1" style={{ fontFamily: 'inherit', whiteSpace: 'pre-wrap' }}>
                    {currentPO.ShipToAddress || 'Alpine Apparels Pvt. Ltd.\nPLOT NO.9B, SECTOR-27A\nFARIDABAD\nHARYANA-121003'}
                  </pre>
                  <div className="small text-muted">
                    <strong>Purchase Type:</strong> {currentPO.PurchaseType || 'Domestic'} |{' '}
                    <strong>Release Option:</strong> {currentPO.ReleaseOption || 'One PO per supplier'}
                  </div>
                </div>
              </Col>
            </Row>

            {/* QUOTE & REFERENCE META */}
            <Row className="g-2 mb-3 bg-light p-2 rounded mx-0 border small">
              <Col md={3}>
                <strong>Quote No:</strong> {currentPO.QuoteNo || 'N/A'}
              </Col>
              <Col md={3}>
                <strong>Quote Date:</strong> {currentPO.QuoteDate || 'N/A'}
              </Col>
              <Col md={3}>
                <strong>Customer Order:</strong> {currentPO.CustomerOrderNo || 'N/A'}
              </Col>
              <Col md={3}>
                <strong>Entered By:</strong> {currentPO.EnteredBy || 'Purchase Dept'}
              </Col>
            </Row>

            {/* ITEMS TABLE */}
            <Table bordered size="sm" className="po-table mb-3">
              <thead>
                <tr>
                  <th style={{ width: '40px' }} className="text-center">#</th>
                  <th>Indent No</th>
                  <th>Item Code</th>
                  <th>Item Description</th>
                  <th>Group</th>
                  <th>Color</th>
                  <th>Size</th>
                  <th className="text-end">Qty</th>
                  <th>UOM</th>
                  <th className="text-end">Rate (₹)</th>
                  <th className="text-end">Amount (₹)</th>
                  <th>Req. Date</th>
                </tr>
              </thead>
              <tbody>
                {(currentPO.items || []).map((item, idx) => (
                  <tr key={idx}>
                    <td className="text-center">{idx + 1}</td>
                    <td className="fw-bold text-primary">{item.IndentNo || item.indentNo || '-'}</td>
                    <td className="font-monospace small">{item.ItemCode || '-'}</td>
                    <td className="fw-semibold">{item.ItemName || item.itemName}</td>
                    <td>{item.Group || item.group || '-'}</td>
                    <td>{item.Color || item.color || '-'}</td>
                    <td>{item.SizeRange || item.sizeRange || '-'}</td>
                    <td className="text-end fw-bold">
                      {Number(item.Quantity || item.OrderQty || item.orderQty || 0).toLocaleString()}
                    </td>
                    <td>{item.UOM || 'PCS'}</td>
                    <td className="text-end">
                      {Number(item.Rate || item.rate || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="text-end fw-bold">
                      {Number(item.Amount || item.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="small text-muted">{item.MatReqDate || item.matReqDate || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </Table>

            {/* OTHER CHARGES & TOTAL BREAKDOWN */}
            <Row className="g-3 mb-3">
              <Col md={7}>
                {Array.isArray(currentPO.OtherCharges) && currentPO.OtherCharges.length > 0 && (
                  <div className="mb-3">
                    <div className="fw-bold small text-secondary mb-1">OTHER CHARGES BREAKDOWN</div>
                    <Table size="sm" bordered className="small bg-white">
                      <thead className="table-light">
                        <tr>
                          <th>Account Name</th>
                          <th>Currency</th>
                          <th className="text-end">Amount</th>
                          <th>Tax Group</th>
                          <th className="text-end">Taxes</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentPO.OtherCharges.map((ch, idx) => (
                          <tr key={idx}>
                            <td>{ch.accountName || '-'}</td>
                            <td>{ch.currency || 'INR'}</td>
                            <td className="text-end">₹{Number(ch.value || 0).toFixed(2)}</td>
                            <td>{ch.taxGroup || 'Exempt'}</td>
                            <td className="text-end">
                              ₹{(Number(ch.cgst || 0) + Number(ch.sgst || 0) + Number(ch.igst || 0)).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                )}

                <div className="po-box small">
                  <div className="fw-bold text-dark mb-1">INSTRUCTIONS & TERMS:</div>
                  {currentPO.PaymentTerms && <div><strong>Payment Terms:</strong> {currentPO.PaymentTerms}</div>}
                  {currentPO.DeliveryTerms && <div><strong>Delivery Terms:</strong> {currentPO.DeliveryTerms}</div>}
                  {currentPO.Remarks && <div><strong>Remarks:</strong> {currentPO.Remarks}</div>}
                  {currentPO.InternalMemo && <div className="text-muted"><strong>Internal Memo:</strong> {currentPO.InternalMemo}</div>}
                </div>
              </Col>

              <Col md={5}>
                <Table size="sm" bordered className="fw-semibold">
                  <tbody>
                    <tr>
                      <td className="text-muted">Items Subtotal</td>
                      <td className="text-end">
                        ₹{Number(currentPO.SubTotal || currentPO.TotalAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                    {Number(currentPO.FreightCharges) > 0 && (
                      <tr>
                        <td className="text-muted">Freight Charges</td>
                        <td className="text-end">₹{Number(currentPO.FreightCharges).toFixed(2)}</td>
                      </tr>
                    )}
                    {Number(currentPO.GSTAmount) > 0 && (
                      <tr>
                        <td className="text-muted">Total GST (18%)</td>
                        <td className="text-end">₹{Number(currentPO.GSTAmount).toFixed(2)}</td>
                      </tr>
                    )}
                    <tr className="table-primary fs-6">
                      <td className="fw-bold text-primary">Grand Total (Net)</td>
                      <td className="text-end fw-bold text-primary">
                        ₹{Number(currentPO.NetAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </Col>
            </Row>

            {/* TERMS & CONDITIONS BLOCK */}
            {currentPO.TermsConditions && (
              <div className="border p-2 rounded bg-light small mb-3">
                <div className="fw-bold text-secondary mb-1">TERMS & CONDITIONS</div>
                <div style={{ whiteSpace: 'pre-wrap' }}>{currentPO.TermsConditions}</div>
              </div>
            )}

            {/* AUTHORIZATION FOOTER */}
            <Row className="mt-4 pt-3 border-top text-center text-muted small">
              <Col md={4}>
                <div className="mb-4">______________________</div>
                <div>Prepared By</div>
              </Col>
              <Col md={4}>
                <div className="mb-4">______________________</div>
                <div>Checked By (Purchase Manager)</div>
              </Col>
              <Col md={4}>
                <div className="mb-4">______________________</div>
                <div>Authorized Signatory</div>
              </Col>
            </Row>
          </div>
        ) : (
          <div className="text-center py-5 text-muted">No Purchase Order loaded.</div>
        )}
      </Modal.Body>

      <Modal.Footer className="bg-light">
        <Button variant="secondary" size="sm" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
