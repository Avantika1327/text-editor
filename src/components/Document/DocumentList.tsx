import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  listDocuments,
  deleteDocument,
  toggleArchiveDocument,
  readAll,
} from "../../utils/documentStorage";

import { FaEdit, FaTrash, FaEye, FaArchive, FaBoxOpen } from "react-icons/fa";

type TabType = "all" | "draft" | "archive";

const labsData = [
  { id: 1, name: "Chemistry Lab", locations: [
      { id: 1, name: "First Floor", departments: ["Organic", "Inorganic", "Physical"] },
      { id: 2, name: "Second Floor", departments: ["Analytical", "Biochemistry"] },
    ] 
  },
  { id: 2, name: "Physics Lab", locations: [
      { id: 3, name: "Third Floor", departments: ["Electronics", "Optics"] },
      { id: 4, name: "Fourth Floor", departments: ["Mechanics", "Quantum"] },
    ] 
  },
  { id: 3, name: "Medical Lab", locations: [
      { id: 5, name: "Fifth Floor", departments: ["Pathology", "Microbiology"] },
      { id: 6, name: "Sixth Floor", departments: ["Biochemistry", "Pharmacology"] },
    ] 
  },
  { id: 4, name: "Computer Lab", locations: [
      { id: 7, name: "Ground Floor", departments: ["Networking", "AI", "Security"] },
      { id: 8, name: "First Floor", departments: ["Web Dev", "Database"] },
    ] 
  },
  { id: 5, name: "Electronics Lab", locations: [
      { id: 9, name: "Second Floor", departments: ["Embedded", "Circuit Design"] },
      { id: 10, name: "Third Floor", departments: ["Signal Processing", "Communication"] },
    ] 
  },
  { id: 6, name: "Mechanical Lab", locations: [
      { id: 11, name: "Fourth Floor", departments: ["Thermodynamics", "Fluid Mechanics"] },
      { id: 12, name: "Fifth Floor", departments: ["Robotics", "CAD"] },
    ] 
  },
  { id: 7, name: "Civil Lab", locations: [
      { id: 13, name: "Ground Floor", departments: ["Structural", "Geotechnical"] },
      { id: 14, name: "First Floor", departments: ["Transportation", "Hydraulics"] },
    ] 
  },
  { id: 8, name: "Biology Lab", locations: [
      { id: 15, name: "Second Floor", departments: ["Genetics", "Botany"] },
      { id: 16, name: "Third Floor", departments: ["Zoology", "Microbiology"] },
    ] 
  },
  { id: 9, name: "Environmental Lab", locations: [
      { id: 17, name: "Fourth Floor", departments: ["Pollution Control", "Waste Management"] },
      { id: 18, name: "Fifth Floor", departments: ["Water Testing", "Soil Analysis"] },
    ] 
  },
  { id: 10, name: "Food Technology Lab", locations: [
      { id: 19, name: "Sixth Floor", departments: ["Food Chemistry", "Nutrition"] },
      { id: 20, name: "Seventh Floor", departments: ["Food Microbiology", "Processing"] },
    ] 
  },
];

export default function DocumentList() {
  const [docs, setDocs] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const navigate = useNavigate();

  // Load documents based on active tab
  const refresh = () => {
    let documents: any[] = readAll();

    if (activeTab === "all") {
      documents = documents.filter((d) => !d.draft && !d.archived);
    } else if (activeTab === "draft") {
      documents = documents.filter((d) => d.draft && !d.archived);
    } else if (activeTab === "archive") {
      documents = documents.filter((d) => d.archived);
    }

    setDocs(documents);
  };

  useEffect(() => {
    refresh();
  }, [activeTab]);

  const [showArchived, setShowArchived] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState<string | false>(false);

  const [selectedLabs, setSelectedLabs] = useState<number[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<number[]>([]);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);

  const [expandedLab, setExpandedLab] = useState<number | null>(null);
  const [expandedLocation, setExpandedLocation] = useState<number | null>(null);

  const [docLabCounts, setDocLabCounts] = useState<Record<string, number>>({});
  const [docSelections, setDocSelections] = useState<Record<string, {
    labs: number[];
    locations: number[];
    departments: string[];
  }
  >>
  ({});

  const refresh2 = () => setDocs(listDocuments(showArchived));

  useEffect(() => {
    refresh2();
    const savedCounts = localStorage.getItem("docLabCounts");
    if (savedCounts) setDocLabCounts(JSON.parse(savedCounts));

    const savedSelections = localStorage.getItem("docSelections");
    if (savedSelections) setDocSelections(JSON.parse(savedSelections));
  }, [showArchived]);

  useEffect(() => {
    if (!sidebarOpen) return;

    if (sidebarOpen && docSelections[sidebarOpen]) {
      const sel = docSelections[sidebarOpen];
      setSelectedLabs(sel.labs);
      setSelectedLocations(sel.locations);
      setSelectedDepartments(sel.departments);
    } else {
      setSelectedLabs(labsData.map((lab) => lab.id));
      setSelectedLocations(labsData.flatMap((lab) => lab.locations.map((loc) => loc.id)));
      setSelectedDepartments(labsData.flatMap((lab) =>
        lab.locations.flatMap((loc) => loc.departments)
      ));
    }
  }, [sidebarOpen]);

  const onDelete = (id: string) => {
    if (!window.confirm("Delete this document?")) return;
    deleteDocument(id);
    refresh();
  };

  const onArchiveToggle = (id: string) => {
    toggleArchiveDocument(id);
    refresh();
  };

  const filtered = docs.filter((d) =>
    d.meta.documentName?.toLowerCase().includes(query.toLowerCase())
  );

  const handleLabToggle = (labId: number) => {
    setSelectedLabs((prev) =>
      prev.includes(labId) ? prev.filter((id) => id !== labId) : [...prev, labId]
    );
  };

  const handleLocationToggle = (locId: number) => {
    setSelectedLocations((prev) =>
      prev.includes(locId) ? prev.filter((id) => id !== locId) : [...prev, locId]
    );
  };

  const handleDeptToggle = (dept: string) => {
    setSelectedDepartments((prev) =>
      prev.includes(dept) ? prev.filter((d) => d !== dept) : [...prev, dept]
    );
  };

  const toggleLabExpand = (labId: number) => {
    setExpandedLab((prev) => (prev === labId ? null : labId));
    setExpandedLocation(null);
  };

  const toggleLocationExpand = (locId: number) => {
    setExpandedLocation((prev) => (prev === locId ? null : locId));
  };

  const handleSubmit = (docId: string | false) => {
    if (!docId) return;

    const newCounts = { ...docLabCounts, [docId]: selectedLabs.length };
    setDocLabCounts(newCounts);
    localStorage.setItem("docLabCounts", JSON.stringify(newCounts));

    const newSelections = {
      ...docSelections,
      [docId]: {
        labs: selectedLabs,
        locations: selectedLocations,
        departments: selectedDepartments,
      },
    };
    setDocSelections(newSelections);
    localStorage.setItem("docSelections", JSON.stringify(newSelections));

    setSidebarOpen(false);
  };

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
            id="all"
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

      {/* Table */}
      <div className="table-responsive shadow-sm">
        <table className="table table-bordered align-middle">
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>Lab Count</th>
              <th>Category</th>
              <th>Created</th>
              <th>Archived</th>
              <th style={{ width: "250px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-4 text-muted">
                  No documents found.
                </td>
              </tr>
            )}
            {filtered.map((d) => (
              <tr key={d.id}>
                <td>{d.meta.documentName}</td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => setSidebarOpen(d.id)}
                  >
                    {docLabCounts[d.id] ?? 0}
                  </button>
                </td>
                <td>{d.meta.category}</td>
                <td>{new Date(d.createdAt).toLocaleString()}</td>
                <td>
                  <span className={`badge ${d.archived ? "bg-danger" : "bg-success"}`}>
                    {d.archived ? "Yes" : "No"}
                  </span>
                </td>
                <td className="d-flex gap-2">
                  <button
                    className="btn btn-sm btn-warning"
                    onClick={() =>  navigate("/document-editor", { state: { documentId: d.id } })}
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
                    {d.archived ? <FaBoxOpen className="me-1" /> : <FaArchive className="me-1" />}
                  </button>
                  <button className="btn btn-sm btn-danger" onClick={() => onDelete(d.id)}>
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Sidebar */}
      {sidebarOpen && (
        <div
          className="position-fixed top-0 end-0 bg-white shadow p-3"
          style={{ width: "350px", height: "100vh", overflowY: "auto" }}
        >
          <button
            className="btn-close float-end"
            onClick={() => setSidebarOpen(false)}
          ></button>
          <h5 className="mb-3">Lab Selection</h5>

          {/* Lab Selection Controls */}
          <div className="d-flex gap-4 mb-3">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="selectAll"
                checked={
                  selectedLabs.length === labsData.map((lab) => lab.id).length &&
                  selectedLocations.length === labsData.flatMap((lab) => lab.locations.map((loc) => loc.id)).length &&
                  selectedDepartments.length === labsData.flatMap((lab) => lab.locations.flatMap((loc) => loc.departments)).length
                }
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedLabs(labsData.map((lab) => lab.id));
                    setSelectedLocations(labsData.flatMap((lab) => lab.locations.map((loc) => loc.id)));
                    setSelectedDepartments(labsData.flatMap((lab) => lab.locations.flatMap((loc) => loc.departments)));
                    (document.getElementById("unselectAll") as HTMLInputElement).checked = false;
                  }
                }}
              />
              <label className="form-check-label fw-bold" htmlFor="selectAll">Select All</label>
            </div>

            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="unselectAll"
                checked={selectedLabs.length === 0 && selectedLocations.length === 0 && selectedDepartments.length === 0}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedLabs([]);
                    setSelectedLocations([]);
                    setSelectedDepartments([]);
                    (document.getElementById("selectAll") as HTMLInputElement).checked = false;
                  }
                }}
              />
              <label className="form-check-label fw-bold" htmlFor="unselectAll">Unselect All</label>
            </div>
          </div>

          {/* Lab Tree */}
          {labsData.map((lab) => (
            <div key={lab.id} className="mb-2">
              <div className="form-check fw-bold d-flex justify-content-between">
                <div className="d-flex align-items-center gap-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={selectedLabs.includes(lab.id)}
                    onChange={() => handleLabToggle(lab.id)}
                  />
                  <label
                    className="form-check-label"
                    onClick={() => toggleLabExpand(lab.id)}
                    style={{ cursor: "pointer" }}
                  >
                    {lab.name}
                  </label>
                </div>
                <span
                  style={{ cursor: "pointer" }}
                  onClick={() => toggleLabExpand(lab.id)}
                >
                  {expandedLab === lab.id ? "−" : "+"}
                </span>
              </div>

              {expandedLab === lab.id &&
                lab.locations.map((loc) => (
                  <div key={loc.id} className="ms-4 mb-1">
                    <div className="form-check d-flex justify-content-between">
                      <div>
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={selectedLocations.includes(loc.id)}
                          onChange={() => handleLocationToggle(loc.id)}
                        />
                        <label
                          className="form-check-label"
                          onClick={() => toggleLocationExpand(loc.id)}
                          style={{ cursor: "pointer" }}
                        >
                          {loc.name}
                        </label>
                      </div>
                      <span
                        style={{ cursor: "pointer" }}
                        onClick={() => toggleLocationExpand(loc.id)}
                      >
                        {expandedLocation === loc.id ? "−" : "+"}
                      </span>
                    </div>

                    {expandedLocation === loc.id &&
                      loc.departments.map((dept, i) => (
                        <div key={i} className="ms-4 form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={selectedDepartments.includes(dept)}
                            onChange={() => handleDeptToggle(dept)}
                          />
                          <label className="form-check-label">{dept}</label>
                        </div>
                      ))}
                  </div>
                ))}
            </div>
          ))}

          <button
            className="btn btn-success mt-3"
            onClick={() => handleSubmit(sidebarOpen)}
          >
            Submit
          </button>
        </div>
      )}
    </div>
  );
}
