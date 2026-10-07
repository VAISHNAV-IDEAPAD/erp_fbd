import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";

import { Line } from "react-chartjs-2";
import { Card } from "react-bootstrap";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export default function DashboardChart({ dashboard = {} }) {

    const safe = dashboard || {};

    const data = {
        labels: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun"
        ],
        datasets: [
            {
                label: "Sales",
                data: [12, 18, 10, 22, 16, safe.SalesValue || 0],
                borderColor: "#0d6efd",
                backgroundColor: "rgba(13,110,253,.15)",
                tension: .4
            },
            {
                label: "Purchase",
                data: [15, 10, 14, 20, 19, safe.PurchaseValue || 0],
                borderColor: "#198754",
                backgroundColor: "rgba(25,135,84,.15)",
                tension: .4
            }
        ]
    };

    const options = {

        responsive: true,

        plugins: {

            legend: {
                position: "top"
            },

            title: {
                display: false
            }

        }

    };

    return (

        <Card className="shadow-sm border-0">

            <Card.Header>

                <strong>Sales vs Purchase</strong>

            </Card.Header>

            <Card.Body>

                <Line
                    data={data}
                    options={options}
                />

            </Card.Body>

        </Card>

    );

}