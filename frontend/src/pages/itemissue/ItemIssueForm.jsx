import { useState } from "react";
import axios from "axios";

export default function ItemIssueForm({ onSaved }) {

  const [form, setForm] = useState({
    issueDate: new Date().toISOString().split("T")[0],
    department: "",
    employee: "",
    itemCode: "",
    itemName: "",
    quantity: "",
    uom: "",
    purpose: "",
    remarks: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.itemCode || !form.quantity) {
      alert("Please enter Item Code and Quantity");
      return;
    }

    try {

      await axios.post(
        `${process.env.REACT_APP_API_URL || "/api"}/stockissues`,
        {
          IssueDate: form.issueDate,
          Department: form.department,
          Employee: form.employee,
          ItemCode: form.itemCode,
          ItemName: form.itemName,
          Quantity: Number(form.quantity),
          UOM: form.uom,
          Purpose: form.purpose,
          Remarks: form.remarks
        }
      );

      alert("Item Issue saved successfully");

      setForm({
        issueDate: new Date().toISOString().split("T")[0],
        department: "",
        employee: "",
        itemCode: "",
        itemName: "",
        quantity: "",
        uom: "",
        purpose: "",
        remarks: ""
      });

      if (onSaved) {
        onSaved();
      }

    } catch (error) {

      console.error(error);

      alert(
        error.response?.data?.message ||
        "Failed to save Item Issue"
      );
    }
  };

  return (
    <div className="card shadow-sm mb-4">

      <div className="card-header bg-primary text-white">
        <h5 className="mb-0">Create Item Issue</h5>
      </div>

      <div className="card-body">

        <form onSubmit={handleSubmit}>

          <div className="row g-3">

            <div className="col-md-3">
              <label className="form-label">Issue Date</label>
              <input
                type="date"
                name="issueDate"
                className="form-control"
                value={form.issueDate}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-3">
              <label className="form-label">Department</label>
              <input
                type="text"
                name="department"
                className="form-control"
                placeholder="Department"
                value={form.department}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-3">
              <label className="form-label">Employee</label>
              <input
                type="text"
                name="employee"
                className="form-control"
                placeholder="Employee"
                value={form.employee}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-3">
              <label className="form-label">Item Code *</label>
              <input
                type="text"
                name="itemCode"
                className="form-control"
                placeholder="Item Code"
                value={form.itemCode}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Item Name</label>
              <input
                type="text"
                name="itemName"
                className="form-control"
                placeholder="Item Name"
                value={form.itemName}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-2">
              <label className="form-label">Quantity *</label>
              <input
                type="number"
                name="quantity"
                className="form-control"
                min="1"
                value={form.quantity}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-2">
              <label className="form-label">UOM</label>
              <input
                type="text"
                name="uom"
                className="form-control"
                placeholder="PCS / KG / MTR"
                value={form.uom}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Purpose</label>
              <input
                type="text"
                name="purpose"
                className="form-control"
                placeholder="Purpose of issue"
                value={form.purpose}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-12">
              <label className="form-label">Remarks</label>
              <textarea
                name="remarks"
                className="form-control"
                rows="2"
                placeholder="Remarks"
                value={form.remarks}
                onChange={handleChange}
              />
            </div>

          </div>

          <div className="mt-4">

            <button
              type="submit"
              className="btn btn-primary me-2"
            >
              Save Issue
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={() =>
                setForm({
                  issueDate: new Date().toISOString().split("T")[0],
                  department: "",
                  employee: "",
                  itemCode: "",
                  itemName: "",
                  quantity: "",
                  uom: "",
                  purpose: "",
                  remarks: ""
                })
              }
            >
              Reset
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}