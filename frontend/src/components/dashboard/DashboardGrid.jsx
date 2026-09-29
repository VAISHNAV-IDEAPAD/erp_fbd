import { Row, Col, Spinner, Alert } from "react-bootstrap";

import DashboardCard from "./DashboardCard";
import DashboardChart from "./DashboardChart";
import ProductionStatus from "./ProductionStatus";
import LowStockTable from "./LowStockTable";
import PendingPOTable from "./PendingPOTable";
import QuickActions from "./QuickActions";
import RecentActivity from "./RecentActivity";

import useDashboard from "../../hooks/useDashboard";

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
               KPI CARDS
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

            {/* ==========================================================
               SALES CHART + PRODUCTION STATUS
            =========================================================== */}

            <Row className="g-4 mb-4">

                <Col xl={8} lg={12}>

                    <DashboardChart
                        dashboard={dashboard}
                    />

                </Col>

                <Col xl={4} lg={12}>

                    <ProductionStatus />

                </Col>

            </Row>

            {/* ==========================================================
               LOW STOCK + PENDING PURCHASE ORDERS
            =========================================================== */}

            <Row className="g-4 mb-4">

                <Col xl={6} lg={12}>

                    <LowStockTable />

                </Col>

                <Col xl={6} lg={12}>

                    <PendingPOTable />

                </Col>

            </Row>

            {/* ==========================================================
               QUICK ACTIONS + RECENT ACTIVITY
            =========================================================== */}

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