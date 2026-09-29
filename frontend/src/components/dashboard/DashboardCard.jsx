import { Card } from "react-bootstrap";
import {
    FaArrowUp,
    FaArrowDown
} from "react-icons/fa";
import "../../styles/cards.css";

export default function DashboardCard({
    title,
    value,
    icon,
    color,
    change = 0
}) {

    return (

        <Card className={`dashboard-card border-start border-5 border-${color}`}>

            <Card.Body>

                <div className="d-flex justify-content-between align-items-center">

                    <div>

                        <div className="card-title-small">
                            {title}
                        </div>

                        <h2 className="fw-bold mt-2">
                            {Number(value).toLocaleString()}
                        </h2>

                        <div
                            className={
                                change >= 0
                                    ? "text-success"
                                    : "text-danger"
                            }
                        >

                            {

                                change >= 0

                                    ?

                                    <FaArrowUp />

                                    :

                                    <FaArrowDown />

                            }

                            {" "}

                            {Math.abs(change)}%

                        </div>

                    </div>

                    <div className="dashboard-icon">

                        {icon}

                    </div>

                </div>

            </Card.Body>

        </Card>

    );

}