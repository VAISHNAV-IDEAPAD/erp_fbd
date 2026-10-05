import React from "react";
import { Button as BsButton } from "react-bootstrap";

export default function Button({ children, ...props }) {
    return <BsButton {...props}>{children}</BsButton>;
}
