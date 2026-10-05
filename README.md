# ERP FBD - Fashion & Apparel Enterprise Resource Planning

[![Live Demo](https://img.shields.io/badge/Live%20Demo-erpfbd.vercel.app-000000?style=for-the-badge&logo=vercel)](https://erpfbd.vercel.app)
[![Deployment Status](https://img.shields.io/badge/Deployment-Production%20Active-success?style=for-the-badge)](https://erpfbd.vercel.app)

> 🌐 **Live Production URL**: [https://erpfbd.vercel.app](https://erpfbd.vercel.app)

A comprehensive Enterprise Resource Planning (ERP) platform designed specifically for apparel and fashion manufacturing, material management, inventory control, and production workflows.

---

## 🌟 Key Modules & Features

- **Dashboard**: Real-time KPI summaries for Inventory, Purchase, Sales, Production, Finance, and MIS.
- **Material Management (MM)**: Indent creation, approval workflows, item requisition, GRN, store transfers, DC pass, and inspection.
- **Production Management (PM)**: Bill of Materials (BOM), work orders, job cards, floor returns, WIP tracking, and variance analysis.
- **Sales & Dispatch (SM)**: Sales orders, packaging slips, dispatch records, invoices, and customer aging.
- **Finance & Accounting**: Customer outstanding, supplier ledger, payment reconciliation, and audit logs.
- **Master Data**: Item master, supplier master, buyer master, color master, department master, and warehouse locations.

---

## 🛠️ Architecture & Tech Stack

- **Frontend**: React 19, React Router v7, React-Bootstrap, React Icons, Axios.
- **Backend**: Node.js, Express.js.
- **Database**: SQLite3 with automatic serverless `/tmp` hydration for cloud environments.
- **Deployment**: Vercel (Frontend SPA + Serverless API).

---

## 🚀 Quick Start (Local Development)

### 1. Backend Server
```bash
cd backend
npm install
npm start
```
Runs at `http://localhost:5000` (Health: `http://localhost:5000/health`).

### 2. Frontend Application
```bash
cd frontend
npm install
npm start
```
Runs at `http://localhost:3000`.

---

## ☁️ Deployment to Vercel

The project is configured for automated deployments to Vercel via GitHub:
- **Production URL**: [https://erpfbd.vercel.app](https://erpfbd.vercel.app)
- **Repository**: `VAISHNAV-IDEAPAD/erp_fbd`
- **Branch**: `main`

Any git push to the `main` branch automatically triggers a new production build on Vercel at [https://erpfbd.vercel.app](https://erpfbd.vercel.app).

---

## 👨‍💻 Author
**Vaishnav V** (`VAISHNAV-IDEAPAD`)
