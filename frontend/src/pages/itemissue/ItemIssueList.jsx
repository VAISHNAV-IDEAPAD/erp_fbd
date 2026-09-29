import { useEffect, useState } from "react";
import axios from "axios";

export default function ItemIssueList({ refresh }) {

  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadIssues = async () => {

    try {

      setLoading(true);

      const response = await axios.get(
        `${process.env.REACT_APP_API_URL || "/api"}/stockissues`
      );

      setIssues(
        response.data.data ||
        response.data ||
        []
      );

    } catch (error) {

      console.error("Error loading Item Issues:", error);

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    loadIssues();
  }, [refresh]);

  return (
    <div className="card shadow-sm">

      <div className="card-header">

        <div className="d-flex justify-content-between align-items-center">

          <h5 className="mb-0">
            Item Issue Register
          </h5>

          <button
            className="btn btn-sm btn-outline-primary"
            onClick={loadIssues}
          >
            Refresh
          </button>

        </div>

      </div>

      <div className="card-body p-0">

        {loading ? (

          <div className="text-center p-4">
            Loading...
          </div>

        ) : issues.length === 0 ? (

          <div className="text-center text-muted p-4">
            No Item Issues found.
          </div>

        ) : (

          <div className="table-responsive">

            <table className="table table-hover table-bordered mb-0">

              <thead className="table-light">

                <tr>
                  <th>#</th>
                  <th>Issue ID</th>
                  <th>Date</th>
                  <th>Department</th>
                  <th>Employee</th>
                  <th>Item Code</th>
                  <th>Item Name</th>
                  <th>Quantity</th>
                  <th>UOM</th>
                  <th>Purpose</th>
                  <th>Remarks</th>
                </tr>

              </thead>

              <tbody>

                {issues.map((issue, index) => (

                  <tr key={issue.IssueID || issue.id || index}>

                    <td>{index + 1}</td>

                    <td>
                      {issue.IssueID || issue.id || "-"}
                    </td>

                    <td>
                      {issue.IssueDate ||
                        issue.issueDate ||
                        "-"}
                    </td>

                    <td>
                      {issue.Department ||
                        issue.department ||
                        "-"}
                    </td>

                    <td>
                      {issue.Employee ||
                        issue.employee ||
                        "-"}
                    </td>

                    <td>
                      {issue.ItemCode ||
                        issue.itemCode ||
                        "-"}
                    </td>

                    <td>
                      {issue.ItemName ||
                        issue.itemName ||
                        "-"}
                    </td>

                    <td>
                      {issue.Quantity ||
                        issue.quantity ||
                        0}
                    </td>

                    <td>
                      {issue.UOM ||
                        issue.uom ||
                        "-"}
                    </td>

                    <td>
                      {issue.Purpose ||
                        issue.purpose ||
                        "-"}
                    </td>

                    <td>
                      {issue.Remarks ||
                        issue.remarks ||
                        "-"}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>
    </div>
  );
}