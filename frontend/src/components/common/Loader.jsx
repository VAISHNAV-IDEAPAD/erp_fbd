import React from "react";
import { Spinner } from "react-bootstrap";

export default function Loader({ message = "Loading..." }) {
    return (
        <div className="text-center py-4">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2 text-muted">{message}</p>
        </div>
    );
}
