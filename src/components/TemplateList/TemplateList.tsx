import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getTemplates,
  deleteTemplate,
  setArchive,
} from "../../utils/templateStorage";
import type { TemplateItem as TItem } from "../../utils/templateStorage";

import { FaEdit, FaTrash, FaEye, FaArchive, FaBoxOpen } from "react-icons/fa";

type FilterType =
  | "all"
  | "header"
  | "footer"
  | "generic"
  | "draft"
  | "draft-header"
  | "draft-footer"
  | "draft-generic"
  | "archived-all"
  | "archived-header"
  | "archived-footer"
  | "archived-generic";

export default function TemplateList() {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<TItem[]>([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");

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
    const q = query.toLowerCase();
    const nameMatch = t.name.toLowerCase().includes(q);
    const typeMatch = t.type?.toLowerCase().includes(q);

    switch (filter) {
      case "header":
        return !t.archived && t.type === "header" && (nameMatch || typeMatch);
      case "footer":
        return !t.archived && t.type === "footer" && (nameMatch || typeMatch);
      case "generic":
        return !t.archived && (!t.type || t.type === "generic") && (nameMatch || typeMatch);

      case "draft":
        return !t.archived && t.metadata?.status === "draft" && (nameMatch || typeMatch);
      case "draft-header":
        return !t.archived && t.type === "header" && t.metadata?.status === "draft";
      case "draft-footer":
        return !t.archived && t.type === "footer" && t.metadata?.status === "draft";
      case "draft-generic":
        return !t.archived && (!t.type || t.type === "generic") && t.metadata?.status === "draft";

      case "archived-all":
        return t.archived && (nameMatch || typeMatch);
      case "archived-header":
        return t.archived && t.type === "header" && (nameMatch || typeMatch);
      case "archived-footer":
        return t.archived && t.type === "footer" && (nameMatch || typeMatch);
      case "archived-generic":
        return t.archived && (!t.type || t.type === "generic") && (nameMatch || typeMatch);

      case "all":
      default:
        return !t.archived && (nameMatch || typeMatch);
    }
  });


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

      {/* Filter bar */}
      <div className="mb-3 d-flex gap-2 flex-wrap">
        {(["all", "header", "footer", "generic"] as FilterType[]).map((f) => (
          <button
            key={f}
            className={`btn btn-sm ${filter === f ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}

        {/* Draft dropdown */}
        <div className="dropdown">
          <button
            className="btn btn-sm btn-outline-success dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
          >
            Drafts
          </button>
          <ul className="dropdown-menu">
            <li>
              <button className="dropdown-item" onClick={() => setFilter("draft")}>
                All Drafts
              </button>
            </li>
            <li>
              <button className="dropdown-item" onClick={() => setFilter("draft-header")}>
                Header Drafts
              </button>
            </li>
            <li>
              <button className="dropdown-item" onClick={() => setFilter("draft-footer")}>
                Footer Drafts
              </button>
            </li>
            <li>
              <button className="dropdown-item" onClick={() => setFilter("draft-generic")}>
                Generic Drafts
              </button>
            </li>
          </ul>
        </div>

        {/* Archive dropdown */}
        <div className="dropdown">
          <button
            className="btn btn-sm btn-outline-dark dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
          >
            Archived
          </button>
          <ul className="dropdown-menu">
            <li>
              <button className="dropdown-item" onClick={() => setFilter("archived-all")}>
                All Archived
              </button>
            </li>
            <li>
              <button className="dropdown-item" onClick={() => setFilter("archived-header")}>
                Header
              </button>
            </li>
            <li>
              <button className="dropdown-item" onClick={() => setFilter("archived-footer")}>
                Footer
              </button>
            </li>
            <li>
              <button className="dropdown-item" onClick={() => setFilter("archived-generic")}>
                Generic
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Search */}
      <div className="d-flex align-items-center mb-3 gap-3">
        <input
          type="text"
          placeholder="Search templates..."
          className="form-control w-25"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* Table */}
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

                  <button className="btn btn-sm d-flex align-items-center btn-outline-warning" onClick={() => navigate(`/builder/${t.id}`)}>
                    <FaEdit />
                  </button>
                  
                  <button className="btn btn-sm d-flex align-items-center btn-outline-info" onClick={() => navigate(`/preview/${t.id}`)}>
                    <FaEye />
                  </button>
                  <button
                    className={`btn btn-sm d-flex align-items-center ${t.archived ? "btn-secondary" : "btn-outline-secondary"}`}
                    onClick={() => onArchiveToggle(t.id, t.archived)}
                  >
                    {t.archived ? <FaBoxOpen className="me-1" /> : <FaArchive className="me-1" />}
                  </button>
                  <button className="btn btn-sm d-flex align-items-center btn-outline-danger" onClick={() => onDelete(t.id)}>
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
