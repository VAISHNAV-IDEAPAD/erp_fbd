import { useState } from "react";
import ItemIssueForm from "./ItemIssueForm";
import ItemIssueList from "./ItemIssueList";

export default function ItemIssue() {
  const [refresh, setRefresh] = useState(0);

  const handleSaved = () => {
    setRefresh((prev) => prev + 1);
  };

  return (
    <div className="container-fluid p-4">

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1">Item Issue</h3>
          <small className="text-muted">
            Issue materials from store to department / employee
          </small>
        </div>
      </div>

      <ItemIssueForm onSaved={handleSaved} />

      <ItemIssueList refresh={refresh} />

    </div>
  );
}