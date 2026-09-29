import {
    ResponsiveContainer,
    LineChart,
    Line,
    CartesianGrid,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";

import { Card } from "react-bootstrap";

export default function PurchaseChart() {

    const data = [
        { month: "Jan", purchase: 120000 },
        { month: "Feb", purchase: 95000 },
        { month: "Mar", purchase: 145000 },
        { month: "Apr", purchase: 110000 },
        { month: "May", purchase: 170000 },
        { month: "Jun", purchase: 180000 },
        { month: "Jul", purchase: 160000 }
    ];

    return (

        <Card className="shadow-sm">

            <Card.Header>

                <strong>Monthly Purchase Trend</strong>

            </Card.Header>

            <Card.Body>

                <ResponsiveContainer width="100%" height={320}>

                    <LineChart data={data}>

                        <CartesianGrid strokeDasharray="3 3" />

                        <XAxis dataKey="month" />

                        <YAxis />

                        <Tooltip />

                        <Line
                            type="monotone"
                            dataKey="purchase"
                            stroke="#0d6efd"
                            strokeWidth={3}
                        />

                    </LineChart>

                </ResponsiveContainer>

            </Card.Body>

        </Card>

    );

}