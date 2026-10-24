import React from "react";
import { Row, Col, Spinner, Alert } from "react-bootstrap";

import DashboardCard from "./DashboardCard";
import DashboardChart from "./DashboardChart";
import ProductionStatus from "./ProductionStatus";
import PendingPOTable from "./PendingPOTable";
import QuickActions from "./QuickActions";
import RecentActivity from "./RecentActivity";
import ScreenSearchBar from "../layout/ScreenSearchBar";

import useDashboard from "../../hooks/useDashboard";
import "../../styles/search.css";

export default function DashboardGrid() {
    const {
        dashboard,
        loading,
        error
    } = useDashboard();

    if (loading) {
        return (
            <div className="text-center py-5">
                <Spinner
                    animation="border"
                    variant="primary"
                />
                <h5 className="mt-3">
                    Loading ERP Dashboard...
                </h5>
            </div>
        );
    }

    if (error) {
        return (
            <Alert variant="danger">
                <h5>Dashboard Error</h5>
                <p className="mb-0">
                    {error}
                </p>
            </Alert>
        );
    }

    return (
        <div className="container-fluid dashboard-page">

            {/* ==========================================================
               TPCS FASHION DASHBOARD HEADER MATCHING SCREENSHOT
            =========================================================== */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "18px",
                    marginTop: "8px",
                    flexWrap: "wrap",
                    gap: "14px"
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <div style={{
                        width: "44px",
                        height: "44px",
                        background: "#5b6bf6",
                        borderRadius: "10px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 4px 12px rgba(91, 107, 246, 0.25)",
                        flexShrink: 0
                    }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3px", width: "18px", height: "18px" }}>
                            <div style={{ background: "#fff", borderRadius: "2px" }}></div>
                            <div style={{ background: "#fff", borderRadius: "2px" }}></div>
                            <div style={{ background: "#fff", borderRadius: "2px" }}></div>
                            <div style={{ background: "#fff", borderRadius: "2px" }}></div>
                        </div>
                    </div>
                    <div>
                        <h1 style={{ fontSize: "23px", fontWeight: 800, color: "#1e293b", margin: 0, letterSpacing: "-0.3px" }}>Dashboard</h1>
                        <p style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>Welcome to TPCS Fashion</p>
                    </div>
                </div>

                {/* SEARCH SCREEN INPUT OPTION MATCHING SCREENSHOT */}
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <ScreenSearchBar />
                </div>
            </div>

            {/* ==========================================================
               KPI CARDS + CHARTS + TABLES
            =========================================================== */}
            <Row className="g-4 mb-4">
                <Col xl={3} lg={6} md={6} sm={12}>
                    <DashboardCard
                        title="Sales"
                        value={dashboard?.SalesValue ?? 0}
                        color="primary"
                        icon="💰"
                        change={18}
                    />
                </Col>

                <Col xl={3} lg={6} md={6} sm={12}>
                    <DashboardCard
                        title="Purchase"
                        value={dashboard?.PurchaseValue ?? 0}
                        color="success"
                        icon="🛒"
                        change={12}
                    />
                </Col>

                <Col xl={3} lg={6} md={6} sm={12}>
                    <DashboardCard
                        title="Inventory"
                        value={dashboard?.InventoryValue ?? 0}
                        color="warning"
                        icon="📦"
                        change={8}
                    />
                </Col>

                <Col xl={3} lg={6} md={6} sm={12}>
                    <DashboardCard
                        title="Production Orders"
                        value={dashboard?.TotalProductionOrders ?? 0}
                        color="danger"
                        icon="🏭"
                        change={5}
                    />
                </Col>
            </Row>

            <Row className="g-4 mb-4">
                <Col xl={8} lg={12}>
                    <DashboardChart dashboard={dashboard} />
                </Col>

                <Col xl={4} lg={12}>
                    <ProductionStatus />
                </Col>
            </Row>

            <Row className="g-4 mb-4">
                <Col xl={12}>
                    <PendingPOTable />
                </Col>
            </Row>

            <Row className="g-4">
                <Col xl={4} lg={12}>
                    <QuickActions />
                </Col>

                <Col xl={8} lg={12}>
                    <RecentActivity />
                </Col>
            </Row>

        </div>
    );
}