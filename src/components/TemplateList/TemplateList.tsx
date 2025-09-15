import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getTemplates,
  deleteTemplate,
  setArchive,
} from "../../utils/templateStorage";
import type { TemplateItem } from "../../utils/templateStorage";

// Import icons
import { FaEdit, FaEye, FaArchive, FaBoxOpen, FaTrash } from "react-icons/fa";

export default function TemplateList() {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<TemplateItem[]>([]);
  const [query, setQuery] = useState("");
  const [showArchived, setShowArchived] = useState(false);

  const refresh = () => setTemplates(getTemplates());

  useEffect(() => {
    refresh();
  }, []);

  const onDelete = (id: string) => {
    if (!window.confirm("Delete this template?")) return;
    deleteTemplate(id);
    refresh();
  };

  const onArchiveToggle = (id: string, cur: boolean) => {
    setArchive(id, !cur);
    refresh();
  };

  const filtered = templates.filter((t) => {
    if (!showArchived && t.archived) return false;
    if (query.trim() === "") return true;
    return t.name.toLowerCase().includes(query.toLowerCase());
  });

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Templates</h2>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/builder")}
        >
          + New Template
        </button>
      </div>

      <div className="d-flex align-items-center mb-3">
        <input
          type="text"
          placeholder="🔍 Search templates..."
          className="form-control w-25 me-3"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="form-check">
          <input
            type="checkbox"
            id="showArchived"
            className="form-check-input"
            checked={showArchived}
            onChange={(e) => setShowArchived(e.target.checked)}
          />
          <label className="form-check-label" htmlFor="showArchived">
            Show archived
          </label>
        </div>
      </div>

      <div className="table-responsive shadow-sm">
        <table className="table table-bordered align-middle">
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>Created</th>
              <th>Updated</th>
              <th>Archived</th>
              <th style={{ width: "220px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => (
              <tr key={t.id}>
                <td className="fw-semibold">{t.name}</td>
                <td>{new Date(t.createdAt).toLocaleString()}</td>
                <td>{new Date(t.updatedAt).toLocaleString()}</td>
                <td>
                  <span
                    className={`badge ${
                      t.archived ? "bg-danger" : "bg-success"
                    }`}
                  >
                    {t.archived ? "Yes" : "No"}
                  </span>
                </td>
                <td>
                  <div className="d-flex flex-wrap gap-2">
                    <button
                      className="btn btn-sm btn-warning d-flex align-items-center"
                      onClick={() => navigate(`/builder/${t.id}`)}
                    >
                      <FaEdit className="me-1" /> 
                    </button>
                    <button
                      className="btn btn-sm btn-info text-white d-flex align-items-center"
                      onClick={() => navigate(`/preview/${t.id}`)}
                    >
                      <FaEye className="me-1" /> 
                    </button>
                    <button
                      className={`btn btn-sm d-flex align-items-center ${
                        t.archived ? "btn-secondary" : "btn-outline-secondary"
                      }`}
                      onClick={() => onArchiveToggle(t.id, t.archived)}
                    >
                      {t.archived ? (
                        <>
                          <FaBoxOpen className="me-1" /> 
                        </>
                      ) : (
                        <>
                          <FaArchive className="me-1" /> 
                        </>
                      )}
                    </button>
                    <button
                      className="btn btn-sm btn-danger d-flex align-items-center"
                      onClick={() => onDelete(t.id)}
                    >
                      <FaTrash className="me-1" /> 
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-4 text-muted">
                  No templates found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
