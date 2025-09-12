import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getTemplates,
  deleteTemplate,
  setArchive,
  duplicateTemplate,
} from "../../utils/templateStorage";
import type { TemplateItem } from "../../utils/templateStorage";

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

  const onDuplicate = (id: string) => {
    const copy = duplicateTemplate(id);
    if (copy) {
      alert("✅ Template duplicated!");
      refresh();
      navigate(`/builder/${copy.id}`);
    }
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
          New Template
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
              <th style={{ width: "250px" }}>Actions</th>
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
                  <div className="btn-group">
                    <button
                      className="btn  btn-sm btn-warning"
                      onClick={() => navigate(`/builder/${t.id}`)}
                    >
                     Edit
                    </button>
                    <button
                      className="btn btn-sm btn-info text-white"
                      onClick={() => navigate(`/preview/${t.id}`)}
                    >
                       View
                    </button>
                    <button
                      className={`btn btn-sm ${
                        t.archived ? "btn-secondary" : "btn-outline-secondary"
                      }`}
                      onClick={() => onArchiveToggle(t.id, t.archived)}
                    >
                      {t.archived ? "Unarchive" : "Archive"}
                    </button>
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => onDuplicate(t.id)}
                    >
                      Duplicate
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => onDelete(t.id)}
                    >
                       Delete
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
