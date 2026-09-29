import { useEffect, useState } from "react";

import {
    Card,
    Table,
    Button,
    Badge,
    Row,
    Col,
    Form,
    InputGroup
} from "react-bootstrap";

import {
    FaSearch,
    FaCheck,
    FaTimes,
    FaEye,
    FaPrint
} from "react-icons/fa";

import {
    getPendingIndents,
    approveIndent,
    rejectIndent
} from "../../services/indentService";

export default function IndentApproval() {

    const [loading, setLoading] = useState(false);

    const [indents, setIndents] = useState([]);

    const [search, setSearch] = useState("");

}