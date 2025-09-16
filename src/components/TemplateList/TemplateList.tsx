import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getTemplates,
  deleteTemplate,
  setArchive,
} from "../../utils/templateStorage"; 
import type { TemplateItem as TItem } from "../../utils/templateStorage";

// Icons
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";

export default function TemplateList() {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<TItem[]>([]);
  const [query, setQuery] = useState("");

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

  const filtered = templates.filter((t) =>
    t.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Templates</h2>
        <div className="d-flex gap-2">
          <button className="btn btn-primary" onClick={() => navigate("/builder")}>
            + New Template
          </button>
          <button
            className="btn btn-success"
            onClick={() => navigate("/builder", { state: { auto: "header" } })}
          >
            + Header
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => navigate("/builder", { state: { auto: "footer" } })}
          >
            + Footer
          </button>
        </div>
      </div>

      <input
        type="text"
        placeholder="Search templates..."
        className="form-control mb-3 w-25"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="table-responsive shadow-sm">
        <table className="table table-bordered align-middle">
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Created</th>
              <th>Updated</th>
              <th>Archived</th>
              <th style={{ width: "250px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-4 text-muted">
                  No templates found.
                </td>
              </tr>
            )}
            {filtered.map((t) => (
              <tr key={t.id}>
                <td>{t.name}</td>
                <td>
                  <span
                    className={`badge ${
                      t.type === "header"
                        ? "bg-success"
                        : t.type === "footer"
                        ? "bg-info"
                        : "bg-secondary"
                    }`}
                  >
                    {t.type ? t.type.charAt(0).toUpperCase() + t.type.slice(1) : "Generic"}
                  </span>
                </td>
                <td>{new Date(t.createdAt).toLocaleString()}</td>
                <td>{new Date(t.updatedAt).toLocaleString()}</td>
                <td>
                  <span className={`badge ${t.archived ? "bg-danger" : "bg-success"}`}>
                    {t.archived ? "Yes" : "No"}
                  </span>
                </td>
                <td className="d-flex gap-2">
                  <button
                    className="btn btn-sm btn-warning"
                    onClick={() => navigate(`/builder/${t.id}`)}
                  >
                    <FaEdit />                   </button>

                  {/* Preview / View button */}
                  <button
                    className="btn btn-sm btn-info text-white"
                    onClick={() => navigate(`/preview/${t.id}`)}
                  >
                    <FaEye /> 
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
                    className="btn btn-sm btn-danger"
                    onClick={() => onDelete(t.id)}
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
