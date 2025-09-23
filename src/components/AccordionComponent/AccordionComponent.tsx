import React, { useState, useEffect } from "react";
import { accordionData } from "../../lib/json/Accordian";

// ---------------------- Types ----------------------
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

interface AccordionItem {
  title: string;
  message?: string;
  note?: boolean;
  children?: AccordionItem[];
}

interface AccordionState {
  [key: string]: { clauses: Clause[] };
}

interface RenderAccordionProps {
  data: AccordionItem[];
  parentId: string;
  state: AccordionState;
  setState: React.Dispatch<React.SetStateAction<AccordionState>>;
  allCategories: string[];
  allFields: Field[];
}

// ---------------------- RenderAccordion ----------------------
const RenderAccordion: React.FC<RenderAccordionProps> = ({
  data,
  parentId,
  state,
  setState,
  allCategories,
  allFields,
}) => {
  const handleNoteChange = (
    itemId: string,
    clauseIndex: number,
    noteIndex: number,
    value: string
  ) => {
    const updated = { ...state };
    updated[itemId].clauses[clauseIndex].notes[noteIndex] = value;
    setState(updated);
  };

  const addNote = (itemId: string, clauseIndex: number) => {
    const updated = { ...state };
    updated[itemId].clauses[clauseIndex].notes.push("");
    setState(updated);
  };

  const deleteNote = (itemId: string, clauseIndex: number, noteIndex: number) => {
    const updated = { ...state };
    if (updated[itemId].clauses[clauseIndex].notes.length > 1) {
      updated[itemId].clauses[clauseIndex].notes.splice(noteIndex, 1);
      setState(updated);
    }
  };

  const addField = (itemId: string, clauseIndex: number) => {
    const updated = { ...state };
    updated[itemId].clauses[clauseIndex].fields.push({
      category: "",
      name: "",
      required: false,
      timezone: false,
      frequency: "daily",
    });
    setState(updated);
  };

  const updateField = (
    itemId: string,
    clauseIndex: number,
    fieldIndex: number,
    key: keyof Field,
    value: string
  ) => {
    const updated = { ...state };
    const field = updated[itemId].clauses[clauseIndex].fields[fieldIndex];

    if (key === "category") {
      field.category = value;
      field.name = "";
      field.required = false;
      field.timezone = false;
    }

    if (key === "name") {
      const selectedField = allFields.find(
        (f) => f.category === field.category && f.name === value
      );
      if (selectedField) {
        field.name = selectedField.name;
        field.required = selectedField.required;
        field.timezone = selectedField.timezone;
      }
    }

    if (key === "frequency") {
      field.frequency = value as Field["frequency"];
    }

    setState(updated);
  };

  const deleteField = (itemId: string, clauseIndex: number, fieldIndex: number) => {
    const updated = { ...state };
    if (updated[itemId].clauses[clauseIndex].fields.length > 1) {
      updated[itemId].clauses[clauseIndex].fields.splice(fieldIndex, 1);
      setState(updated);
    }
  };

  return (
    <div className="mt-2 accordion" id={`accordion-${parentId}`}>
      {data.map((item, index) => {
        const itemId = `${parentId}-${index}`;

        if (!state[itemId]) {
          state[itemId] = {
            clauses: [
              {
                id: "a",
                title: "Required",
                notes: [""],
                fields: [
                  {
                    category: "",
                    name: "",
                    required: false,
                    timezone: false,
                    frequency: "daily",
                  },
                ],
              },
            ],
          };
        }

        const clauses = state[itemId].clauses;

        return (
          <div className="accordion-item" key={itemId}>
            <h2 className="accordion-header" id={`heading-${itemId}`}>
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target={`#collapse-${itemId}`}
                aria-expanded="false"
                aria-controls={`collapse-${itemId}`}
              >
                {item.title}
              </button>
            </h2>
            <div
              id={`collapse-${itemId}`}
              className="accordion-collapse collapse"
              aria-labelledby={`heading-${itemId}`}
              data-bs-parent={`#accordion-${parentId}`}
            >
              <div className="accordion-body">
                {item?.message && (
                  <p>
                    <em>{item.message}</em>
                  </p>
                )}

                {item.note === true && (
                  <div className="accordion" id={`clauses-${itemId}`}>
                    {clauses.map((clause, clauseIndex) => {
                      const clauseUniqueId = `${itemId}-clause-${clauseIndex}`;

                      return (
                        <div className="accordion-item" key={clauseUniqueId}>
                          <h2 className="accordion-header" id={`heading-${clauseUniqueId}`}>
                            <button
                              className="accordion-button collapsed"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target={`#collapse-${clauseUniqueId}`}
                            >
                              <input
                                type="text"
                                className="bg-transparent border-0 form-control"
                                value={clause.title}
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) => {
                                  const updated = { ...state };
                                  updated[itemId].clauses[clauseIndex].title = e.target.value;
                                  setState(updated);
                                }}
                              />
                            </button>
                          </h2>
                          <div
                            id={`collapse-${clauseUniqueId}`}
                            className="accordion-collapse collapse"
                            aria-labelledby={`heading-${clauseUniqueId}`}
                          >
                            <div className="accordion-body">
                              {/* Notes */}
                              {clause.notes.map((note, noteIndex) => (
                                <div
                                  key={noteIndex}
                                  className="gap-2 mb-3 d-flex align-items-center"
                                >
                                  <textarea
                                    className="form-control"
                                    placeholder="Write a note..."
                                    value={note}
                                    onChange={(e) =>
                                      handleNoteChange(
                                        itemId,
                                        clauseIndex,
                                        noteIndex,
                                        e.target.value
                                      )
                                    }
                                  />
                                  <button
                                    className="btn btn-success"
                                    onClick={() => addNote(itemId, clauseIndex)}
                                  >
                                    <i className="bi bi-plus-lg"></i>
                                  </button>
                                  <button
                                    className="btn btn-danger"
                                    onClick={() =>
                                      deleteNote(itemId, clauseIndex, noteIndex)
                                    }
                                    disabled={clause.notes.length === 1}
                                  >
                                    <i className="bi bi-trash"></i>
                                  </button>
                                </div>
                              ))}

                              {/* Fields */}
                              <h6 className="mt-4 fw-bold">Fields</h6>
                              {clause.fields.map((field, fieldIndex) => (
                                <div
                                  key={fieldIndex}
                                  className="flex-wrap gap-3 p-3 mb-3 border rounded bg-light d-flex align-items-end"
                                >
                                  {/* Category */}
                                  <div className="flex-grow-1">
                                    <label className="form-label fw-semibold">
                                      Category <span className="text-danger">*</span>
                                    </label>
                                    <select
                                      className="form-select"
                                      value={field.category}
                                      onChange={(e) =>
                                        updateField(
                                          itemId,
                                          clauseIndex,
                                          fieldIndex,
                                          "category",
                                          e.target.value
                                        )
                                      }
                                    >
                                      <option value="">Select Category</option>
                                      {allCategories.map((c) => (
                                        <option key={c} value={c}>
                                          {c}
                                        </option>
                                      ))}
                                    </select>
                                  </div>

                                  {/* Field Name */}
                                  <div className="flex-grow-1">
                                    <label className="form-label fw-semibold">
                                      Field Name <span className="text-danger">*</span>
                                    </label>
                                    <select
                                      className="form-select"
                                      value={field.name}
                                      onChange={(e) =>
                                        updateField(
                                          itemId,
                                          clauseIndex,
                                          fieldIndex,
                                          "name",
                                          e.target.value
                                        )
                                      }
                                      disabled={!field.category}
                                    >
                                      <option value="">Select Field</option>
                                      {allFields
                                        .filter((f) => f.category === field.category)
                                        .map((f) => (
                                          <option key={f.name} value={f.name}>
                                            {f.name}
                                          </option>
                                        ))}
                                    </select>
                                  </div>

                                  {/* Required */}
                                  <div>
                                    <label className="form-label fw-semibold">
                                      Required
                                    </label>
                                    <div className="form-check">
                                      <input
                                        type="checkbox"
                                        className="form-check-input"
                                        checked={field.required}
                                        readOnly
                                      />
                                    </div>
                                  </div>

                                  {/* Timezone */}
                                  <div>
                                    <label className="form-label fw-semibold">
                                      Timezone
                                    </label>
                                    <div className="form-check">
                                      <input
                                        type="checkbox"
                                        className="form-check-input"
                                        checked={field.timezone}
                                        readOnly
                                      />
                                    </div>
                                  </div>

                                  {/* Frequency */}
                                  <div className="flex-grow-1">
                                    <label className="form-label fw-semibold">
                                      Frequency
                                    </label>
                                    <select
                                      className="form-select"
                                      value={field.frequency}
                                      onChange={(e) =>
                                        updateField(
                                          itemId,
                                          clauseIndex,
                                          fieldIndex,
                                          "frequency",
                                          e.target.value
                                        )
                                      }
                                    >
                                      <option value="daily">Daily</option>
                                      <option value="weekly">Weekly</option>
                                      <option value="monthly">Monthly</option>
                                    </select>
                                  </div>

                                  {/* Delete */}
                                  <div>
                                    <button
                                      className="mt-2 btn btn-outline-danger"
                                      onClick={() =>
                                        deleteField(itemId, clauseIndex, fieldIndex)
                                      }
                                      disabled={clause.fields.length === 1}
                                    >
                                      <i className="bi bi-trash"></i>
                                    </button>
                                  </div>
                                </div>
                              ))}

                              {/* Add Field */}
                              <div className="d-flex justify-content-end">
                                <button
                                  className="mt-2 btn btn-primary btn-sm"
                                  onClick={() => addField(itemId, clauseIndex)}
                                >
                                  <i className="bi bi-plus-lg me-1"></i> Add Field
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Recursive children */}
                {item.children && item.children.length > 0 && (
                  <RenderAccordion
                    data={item.children}
                    parentId={`child-${itemId}`}
                    state={state}
                    setState={setState}
                    allCategories={allCategories}
                    allFields={allFields}
                  />
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ---------------------- Main Component ----------------------
const AccordionComponent: React.FC = () => {
  const [state, setState] = useState<AccordionState>({});
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [allFields, setAllFields] = useState<Field[]>([]);

  useEffect(() => {
    const storedCategories: { name: string }[] = JSON.parse(
      localStorage.getItem("categories") || "[]"
    );
    const storedFields: Field[] = JSON.parse(
      localStorage.getItem("fields") || "[]"
    );

    setAllCategories(storedCategories.map((c) => c.name));
    setAllFields(storedFields);
  }, []);

  return (
    <div className="mt-5 d-flex justify-content-center">
      <div className="accordion w-75" id="mainAccordion">
        <RenderAccordion
          data={accordionData}
          parentId="root"
          state={state}
          setState={setState}
          allCategories={allCategories}
          allFields={allFields}
        />
      </div>
    </div>
  );
};

export default AccordionComponent;
