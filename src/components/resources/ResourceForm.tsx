import { useState, useEffect } from "react";
import type { ChangeEvent } from "react";

interface Field {
  category: string;
  name: string;
  required: boolean;
  timezone: boolean;
  frequency: "daily" | "weekly" | "monthly";
}

interface Clause {
  id: string;
  title: string;
  notes: string[];
  fields: Field[];
}

interface StoredCategory {
  name: string;
}

interface StoredField {
  category: string;
  name: string;
  required: boolean;
  timezone: boolean;
}

export default function ResourceForm() {
  const [clauses, setClauses] = useState<Clause[]>([
    {
      id: "a",
      title: "6.1.1 (a)",
      notes: [""],
      fields: [
        { category: "", name: "", required: false, timezone: false, frequency: "daily" },
      ],
    },
    {
      id: "b",
      title: "6.1.1 (b)",
      notes: [""],
      fields: [
        { category: "", name: "", required: false, timezone: false, frequency: "daily" },
      ],
    },
  ]);

  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [allFields, setAllFields] = useState<StoredField[]>([]);

  useEffect(() => {
    const storedCategories: StoredCategory[] = JSON.parse(localStorage.getItem("categories") || "[]");
    const storedFields: StoredField[] = JSON.parse(localStorage.getItem("fields") || "[]");

    setAllCategories(storedCategories.map(c => c.name));
    setAllFields(storedFields);
  }, []);

  // --- Notes ---
  const handleNoteChange = (
  clauseIndex: number,
  noteIndex: number,
  e: ChangeEvent<HTMLTextAreaElement>
) => {
  const updated = [...clauses];
  updated[clauseIndex].notes[noteIndex] = e.target.value;
  setClauses(updated);
};
  const addNote = (clauseIndex: number) => {
    const updated = [...clauses];
    updated[clauseIndex].notes.push("");
    setClauses(updated);
  };

  const deleteNote = (clauseIndex: number, noteIndex: number) => {
    const updated = [...clauses];
    if (updated[clauseIndex].notes.length > 1) {
      updated[clauseIndex].notes.splice(noteIndex, 1);
      setClauses(updated);
    }
  };

  // --- Fields ---
  const addField = (clauseIndex: number) => {
    const updated = [...clauses];
    updated[clauseIndex].fields.push({
      category: "",
      name: "",
      required: false,
      timezone: false,
      frequency: "daily",
    });
    setClauses(updated);
  };

  const updateField = (clauseIndex: number, fieldIndex: number, key: keyof Field, value: string) => {
    const updated = [...clauses];
    const field = updated[clauseIndex].fields[fieldIndex];

    if (key === "category") {
      field.category = value;
      field.name = "";
      field.required = false;
      field.timezone = false;
    }

    if (key === "name") {
      const selectedField = allFields.find(f => f.category === field.category && f.name === value);
      if (selectedField) {
        field.name = selectedField.name;
        field.required = selectedField.required;
        field.timezone = selectedField.timezone;
      } else {
        field.name = value;
        field.required = false;
        field.timezone = false;
      }
    }

    if (key === "frequency") {
      field.frequency = value as Field["frequency"];
    }

    setClauses(updated);
  };

  const deleteField = (clauseIndex: number, fieldIndex: number) => {
    const updated = [...clauses];
    if (updated[clauseIndex].fields.length > 1) {
      updated[clauseIndex].fields.splice(fieldIndex, 1);
      setClauses(updated);
    }
  };

  return (
    <div className="container my-4">
      <h2 className="fw-bold">6. Resource requirements</h2>
      <p className="text-muted">6.1 General → 6.1.1</p>

      {clauses.map((clause, clauseIndex) => (
        <div key={clause.id} className="card mb-4 shadow-sm">
          <div className="card-header fw-semibold">{clause.title}</div>
          <div className="card-body">
            {/* Notes Section */}
            {clause.notes.map((note, noteIndex) => (
              <div className="mb-3 d-flex align-items-center gap-2" key={noteIndex}>
                <textarea
  className="form-control"
  placeholder="Write a note..."
  value={note}
  onChange={(e) => handleNoteChange(clauseIndex, noteIndex, e)}
/>
                <button className="btn btn-success" onClick={() => addNote(clauseIndex)}>
                  <i className="bi bi-plus-lg">+</i>
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => deleteNote(clauseIndex, noteIndex)}
                  disabled={clause.notes.length === 1}
                >
                  <i className="bi bi-trash">Delete</i>
                </button>
              </div>
            ))}

            {/* Fields Section */}
            <h6 className="fw-bold mt-4">Fields</h6>
            {clause.fields.map((field, fieldIndex) => (
              <div
                key={fieldIndex}
                className="border rounded p-3 mb-3 bg-light d-flex flex-wrap align-items-end gap-3"
              >
                {/* Category */}
                <div className="flex-grow-1">
                  <label className="form-label fw-semibold">Category</label>
                  <select
                    className="form-select"
                    value={field.category}
                    onChange={(e) => updateField(clauseIndex, fieldIndex, "category", e.target.value)}
                  >
                    <option value="">Select Category</option>
                    {allCategories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Field Name */}
                <div className="flex-grow-1">
                  <label className="form-label fw-semibold">Field Name</label>
                  <select
                    className="form-select"
                    value={field.name}
                    onChange={(e) => updateField(clauseIndex, fieldIndex, "name", e.target.value)}
                    disabled={!field.category}
                  >
                    <option value="">Select Field</option>
                    {allFields
                      .filter(f => f.category === field.category)
                      .map(f => (
                        <option key={f.name} value={f.name}>{f.name}</option>
                      ))}
                  </select>
                </div>

                {/* Required */}
                <div>
                  <label className="form-label fw-semibold">Required</label>
                  <div className="form-check">
                    <input type="checkbox" className="form-check-input" checked={field.required} readOnly />
                  </div>
                </div>

                {/* Timezone */}
                <div>
                  <label className="form-label fw-semibold">Timezone</label>
                  <div className="form-check">
                    <input type="checkbox" className="form-check-input" checked={field.timezone} readOnly />
                  </div>
                </div>

                {/* Frequency */}
                <div className="flex-grow-1">
                  <label className="form-label fw-semibold">Frequency</label>
                  <select
                    className="form-select"
                    value={field.frequency}
                    onChange={(e) => updateField(clauseIndex, fieldIndex, "frequency", e.target.value)}
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                {/* Delete */}
                <div>
                  <button
                    className="btn btn-outline-danger mt-2"
                    onClick={() => deleteField(clauseIndex, fieldIndex)}
                    disabled={clause.fields.length === 1}
                  >
                    <i className="bi bi-trash">Delete</i>
                  </button>
                </div>
              </div>
            ))}

            {/* Add Field Button */}
            <button
              className="btn btn-primary btn-sm mt-2 float-end"
              onClick={() => addField(clauseIndex)}
            >
              <i className="bi bi-plus-lg me-1"></i> Add Field
            </button>
          </div>
        </div>
      ))}

      {/* Save Button */}
      <button className="btn btn-success mb-4">
        <i className="bi bi-save me-2"></i> Save
      </button>

      {/* JSON Preview */}
      <div className="card">
        <div className="card-header bg-light fw-semibold">
          Live JSON Payload Preview
        </div>
        <div className="card-body">
          <pre className="mb-0" style={{ whiteSpace: "pre-wrap" }}>
            {JSON.stringify(
              {
                section: "6. Resource requirements",
                subsection: "6.1 General",
                clause: "6.1.1",
                ...clauses.reduce((acc: any, c) => {
                  acc[c.id] = { notes: c.notes, fields: c.fields };
                  return acc;
                }, {}),
              },
              null,
              2
            )}
          </pre>
        </div>
      </div>
    </div>
  );
}
