import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
    FaPlus,
    FaSearch,
    FaEye,
    FaEdit,
    FaSyncAlt,
    FaPalette,
} from "react-icons/fa";

const API_URL = process.env.REACT_APP_API_URL || "/api";

export default function ColourMasters() {

    const navigate = useNavigate();

    const [colours, setColours] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);

    // ---------------------------------------
    // LOAD COLOURS
    // ---------------------------------------
    const loadColours = async () => {

        try {

            setLoading(true);

            const response = await axios.get(
                `${API_URL}/colours`
            );

            const data =
                response.data?.data ||
                response.data ||
                [];

            setColours(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (error) {

            console.error(
                "Error loading colours:",
                error
            );

            setColours([]);

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {
        loadColours();
    }, []);

    // ---------------------------------------
    // SEARCH
    // ---------------------------------------
    const filteredColours = colours.filter(
        (colour) => {

            const text =
                search.toLowerCase();

            return (
                String(
                    colour.ColourCode ||
                    colour.ColorCode ||
                    colour.colourCode ||
                    colour.colorCode ||
                    ""
                )
                    .toLowerCase()
                    .includes(text)

                ||

                String(
                    colour.ColourName ||
                    colour.ColorName ||
                    colour.colourName ||
                    colour.colorName ||
                    ""
                )
                    .toLowerCase()
                    .includes(text)

                ||

                String(
                    colour.Description ||
                    colour.description ||
                    ""
                )
                    .toLowerCase()
                    .includes(text)
            );

        }
    );

    // ---------------------------------------
    // NEW COLOUR
    // ---------------------------------------
    const handleNewColour = () => {
        navigate("/master/colours/new");
    };

    // ---------------------------------------
    // VIEW COLOUR
    // ---------------------------------------
    const handleView = (id) => {
        navigate(`/master/colours/view/${id}`);
    };

    // ---------------------------------------
    // EDIT COLOUR
    // ---------------------------------------
    const handleEdit = (id) => {
        navigate(`/master/colours/edit/${id}`);
    };

    return (

        <div className="container-fluid py-3">

            {/* =====================================
                HEADER
            ===================================== */}

            <div className="d-flex justify-content-between align-items-center mb-3">

                <div>

                    <h4 className="fw-bold mb-1">

                        <FaPalette className="me-2" />

                        Colour Master

                    </h4>

                    <small className="text-muted">
                        Colour / Color Master
                    </small>

                </div>

                <div className="d-flex gap-2">

                    <button
                        className="btn btn-outline-secondary"
                        onClick={loadColours}
                        disabled={loading}
                    >

                        <FaSyncAlt />

                        <span className="ms-2">
                            Refresh
                        </span>

                    </button>

                    <button
                        className="btn btn-primary"
                        onClick={handleNewColour}
                    >

                        <FaPlus className="me-2" />

                        New Colour

                    </button>

                </div>

            </div>


            {/* =====================================
                SEARCH
            ===================================== */}

            <div className="card shadow-sm mb-3">

                <div className="card-body">

                    <div className="input-group">

                        <span className="input-group-text">
                            <FaSearch />
                        </span>

                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search Colour Code, Colour Name or Description..."
                            value={search}
                            onChange={(e) =>
                                setSearch(
                                    e.target.value
                                )
                            }
                        />

                        {search && (

                            <button
                                className="btn btn-outline-secondary"
                                onClick={() =>
                                    setSearch("")
                                }
                            >
                                Clear
                            </button>

                        )}

                    </div>

                </div>

            </div>


            {/* =====================================
                COLOUR TABLE
            ===================================== */}

            <div className="card shadow-sm">

                <div className="card-header bg-white d-flex justify-content-between align-items-center">

                    <strong>
                        Colour Register
                    </strong>

                    <span className="badge bg-secondary">
                        {filteredColours.length} Records
                    </span>

                </div>

                <div className="table-responsive">

                    <table className="table table-hover table-bordered align-middle mb-0">

                        <thead className="table-light">

                            <tr>

                                <th>#</th>

                                <th>Colour Code</th>

                                <th>Colour Name</th>

                                <th>Description</th>

                                <th style={{ width: "120px" }}>
                                    Action
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {loading ? (

                                <tr>

                                    <td
                                        colSpan="5"
                                        className="text-center py-4"
                                    >
                                        Loading colours...
                                    </td>

                                </tr>

                            ) : filteredColours.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="5"
                                        className="text-center py-5"
                                    >

                                        <div className="text-muted mb-2">
                                            No colours found
                                        </div>

                                        <button
                                            className="btn btn-sm btn-primary"
                                            onClick={
                                                handleNewColour
                                            }
                                        >

                                            <FaPlus className="me-1" />

                                            Create First Colour

                                        </button>

                                    </td>

                                </tr>

                            ) : (

                                filteredColours.map(
                                    (colour, index) => {

                                        const id =
                                            colour.ColourID ||
                                            colour.ColorID ||
                                            colour.colourId ||
                                            colour.colorId ||
                                            colour.id;

                                        const code =
                                            colour.ColourCode ||
                                            colour.ColorCode ||
                                            colour.colourCode ||
                                            colour.colorCode ||
                                            "-";

                                        const name =
                                            colour.ColourName ||
                                            colour.ColorName ||
                                            colour.colourName ||
                                            colour.colorName ||
                                            "-";

                                        const description =
                                            colour.Description ||
                                            colour.description ||
                                            "-";

                                        return (

                                            <tr
                                                key={
                                                    id ||
                                                    index
                                                }
                                            >

                                                <td>
                                                    {index + 1}
                                                </td>

                                                <td>
                                                    <strong>
                                                        {code}
                                                    </strong>
                                                </td>

                                                <td>
                                                    {name}
                                                </td>

                                                <td>
                                                    {description}
                                                </td>

                                                <td>

                                                    <div className="d-flex gap-1">

                                                        <button
                                                            className="btn btn-sm btn-outline-primary"
                                                            title="View"
                                                            onClick={() =>
                                                                handleView(
                                                                    id
                                                                )
                                                            }
                                                        >

                                                            <FaEye />

                                                        </button>

                                                        <button
                                                            className="btn btn-sm btn-outline-secondary"
                                                            title="Edit"
                                                            onClick={() =>
                                                                handleEdit(
                                                                    id
                                                                )
                                                            }
                                                        >

                                                            <FaEdit />

                                                        </button>

                                                    </div>

                                                </td>

                                            </tr>

                                        );

                                    }
                                )

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    );
}