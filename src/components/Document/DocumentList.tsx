import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  listDocuments,
  deleteDocument,
  toggleArchiveDocument,
  readAll,   // ✅ हे नवीन
} from "../../utils/documentStorage";

import { FaEdit, FaTrash, FaEye, FaArchive, FaBoxOpen } from "react-icons/fa";

type TabType = "all" | "draft" | "archive";

export default function DocumentList() {
  const [docs, setDocs] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const navigate = useNavigate();

  // Load documents based on active tab
  const refresh = () => {
  let documents: any[] = readAll();

  if (activeTab === "all") {
    // फक्त final documents (draft = false && archived = false)
    documents = documents.filter((d) => !d.draft && !d.archived);
  } else if (activeTab === "draft") {
    // फक्त draft documents
    documents = documents.filter((d) => d.draft && !d.archived);
  } else if (activeTab === "archive") {
    // फक्त archived
    documents = documents.filter((d) => d.archived);
  }

  setDocs(documents);
};

  useEffect(() => {
    refresh();
  }, [activeTab]);

  const onDelete = (id: string) => {
    if (!window.confirm("Delete this document?")) return;
    deleteDocument(id);
    refresh();
  };

  const onArchiveToggle = (id: string) => {
    toggleArchiveDocument(id);
    refresh();
  };

  // Filter documents by search query
  const filtered = docs.filter((d) =>
    d.meta.documentName?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Documents</h2>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/document")}
        >
          + New Document
        </button>
      </div>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "all" ? "active" : ""}`}
            onClick={() => setActiveTab("all")}
          >
            All
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "draft" ? "active" : ""}`}
            onClick={() => setActiveTab("draft")}
          >
            Draft
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "archive" ? "active" : ""}`}
            onClick={() => setActiveTab("archive")}
          >
            Archive
          </button>
        </li>
      </ul>

      <div className="d-flex align-items-center mb-3 gap-3">
        <input
          type="text"
          placeholder="Search documents..."
          className="form-control w-25"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="table-responsive shadow-sm">
        <table className="table table-bordered align-middle">
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Created</th>
              <th>Archived</th>
              <th style={{ width: "250px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-4 text-muted">
                  No documents found.
                </td>
              </tr>
            )}
            {filtered.map((d) => (
              <tr key={d.id}>
                <td>{d.meta.documentName}</td>
                <td>{d.meta.category}</td>
                <td>{new Date(d.createdAt).toLocaleString()}</td>
                <td>
                  <span
                    className={`badge ${
                      d.archived ? "bg-danger" : "bg-success"
                    }`}
                  >
                    {d.archived ? "Yes" : "No"}
                  </span>
                </td>
                <td className="d-flex gap-2">
                  <button
                    className="btn btn-sm btn-warning"
                    onClick={() =>
                      navigate("/document-editor", {
                        state: { documentId: d.id },
                      })
                    }
                  >
                    <FaEdit />
                  </button>

                  <button
                    className="btn btn-sm btn-info text-white"
                    onClick={() => navigate(`/docpreview/${d.id}`)}
                  >
                    <FaEye />
                  </button>

                  <button
                    className={`btn btn-sm d-flex align-items-center ${
                      d.archived ? "btn-secondary" : "btn-outline-secondary"
                    }`}
                    onClick={() => onArchiveToggle(d.id)}
                  >
                    {d.archived ? (
                      <FaBoxOpen className="me-1" />
                    ) : (
                      <FaArchive className="me-1" />
                    )}
                  </button>

                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => onDelete(d.id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}