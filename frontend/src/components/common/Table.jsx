import React from "react";
import { Table as BsTable } from "react-bootstrap";

export default function Table({ children, ...props }) {
    return <BsTable hover responsive {...props}>{children}</BsTable>;
}
