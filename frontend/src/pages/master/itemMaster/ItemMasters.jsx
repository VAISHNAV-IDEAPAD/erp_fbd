import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
    FaPlus,
    FaSearch,
    FaEye,
    FaEdit,
    FaSyncAlt,
    FaBoxOpen,
} from "react-icons/fa";

const API_URL = process.env.REACT_APP_API_URL || "/api";

export default function ItemMasters() {

    const navigate = useNavigate();

    const [items, setItems] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);

    // ---------------------------------------
    // LOAD ITEMS
    // ---------------------------------------
    const loadItems = async () => {

        try {

            setLoading(true);

            const response = await axios.get(
                `${API_URL}/items`
            );

            const data =
                response.data?.data ||
                response.data ||
                [];

            setItems(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (error) {

            console.error(
                "Error loading items:",
                error
            );

            setItems([]);

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {
        loadItems();
    }, []);

    // ---------------------------------------
    // SEARCH
    // ---------------------------------------
    const filteredItems = items.filter((item) => {

        const text = search.toLowerCase();

        return (
            String(
                item.ItemCode ||
                item.itemCode ||
                ""
            )
                .toLowerCase()
                .includes(text)

            ||

            String(
                item.ItemName ||
                item.itemName ||
                ""
            )
                .toLowerCase()
                .includes(text)

            ||

            String(
                item.Category ||
                item.category ||
                ""
            )
                .toLowerCase()
                .includes(text)

            ||

            String(
                item.UOM ||
                item.uom ||
                ""
            )
                .toLowerCase()
                .includes(text)
        );

    });

    // ---------------------------------------
    // NEW ITEM
    // ---------------------------------------
    const handleNewItem = () => {
        navigate("/master/items/new");
    };

    // ---------------------------------------
    // VIEW ITEM
    // ---------------------------------------
    const handleView = (id) => {
        navigate(`/master/items/view/${id}`);
    };

    // ---------------------------------------
    // EDIT ITEM
    // ---------------------------------------
    const handleEdit = (id) => {
        navigate(`/master/items/edit/${id}`);
    };

    return (

        <div className="container-fluid py-3">

            {/* =====================================
                HEADER
            ===================================== */}

            <div className="d-flex justify-content-between align-items-center mb-3">

                <div>

                    <h4 className="fw-bold mb-1">

                        <FaBoxOpen className="me-2" />

                        Item Master

                    </h4>

                    <small className="text-muted">
                        Item / Material Master
                    </small>

                </div>

                <div className="d-flex gap-2">

                    <button
                        className="btn btn-outline-secondary"
                        onClick={loadItems}
                        disabled={loading}
                    >

                        <FaSyncAlt />

                        <span className="ms-2">
                            Refresh
                        </span>

                    </button>

                    <button
                        className="btn btn-primary"
                        onClick={handleNewItem}
                    >

                        <FaPlus className="me-2" />

                        New Item

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
                            placeholder="Search Item Code, Item Name, Category or UOM..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
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
                ITEM TABLE
            ===================================== */}

            <div className="card shadow-sm">

                <div className="card-header bg-white d-flex justify-content-between align-items-center">

                    <strong>
                        Item Register
                    </strong>

                    <span className="badge bg-secondary">
                        {filteredItems.length} Records
                    </span>

                </div>

                <div className="table-responsive">

                    <table className="table table-hover table-bordered align-middle mb-0">

                        <thead className="table-light">

                            <tr>

                                <th>#</th>

                                <th>Item Code</th>

                                <th>Item Name</th>

                                <th>Category</th>

                                <th>UOM</th>

                                <th>Rate</th>

                                <th>Opening Stock</th>

                                <th>Current Stock</th>

                                <th style={{ width: "120px" }}>
                                    Action
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {loading ? (

                                <tr>

                                    <td
                                        colSpan="9"
                                        className="text-center py-4"
                                    >
                                        Loading items...
                                    </td>

                                </tr>

                            ) : filteredItems.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="9"
                                        className="text-center py-5"
                                    >

                                        <div className="text-muted mb-2">

                                            No items found

                                        </div>

                                        <button
                                            className="btn btn-sm btn-primary"
                                            onClick={handleNewItem}
                                        >

                                            <FaPlus className="me-1" />

                                            Create First Item

                                        </button>

                                    </td>

                                </tr>

                            ) : (

                                filteredItems.map(
                                    (item, index) => {

                                        const id =
                                            item.ItemID ||
                                            item.itemId ||
                                            item.id;

                                        const itemCode =
                                            item.ItemCode ||
                                            item.itemCode ||
                                            "-";

                                        const itemName =
                                            item.ItemName ||
                                            item.itemName ||
                                            "-";

                                        const category =
                                            item.Category ||
                                            item.category ||
                                            "-";

                                        const uom =
                                            item.UOM ||
                                            item.uom ||
                                            "-";

                                        const rate =
                                            item.Rate ??
                                            item.rate ??
                                            0;

                                        const openingStock =
                                            item.OpeningStock ??
                                            item.openingStock ??
                                            0;

                                        const currentStock =
                                            item.CurrentStock ??
                                            item.currentStock ??
                                            0;

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
                                                        {itemCode}
                                                    </strong>
                                                </td>

                                                <td>
                                                    {itemName}
                                                </td>

                                                <td>
                                                    {category}
                                                </td>

                                                <td>
                                                    {uom}
                                                </td>

                                                <td>
                                                    {rate}
                                                </td>

                                                <td>
                                                    {openingStock}
                                                </td>

                                                <td>
                                                    <strong>
                                                        {currentStock}
                                                    </strong>
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