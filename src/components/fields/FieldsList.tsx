// src/fields/FieldsList.tsx
import React, { useEffect, useState } from "react";
import FieldsForm from "./FieldsForm";
import type { FieldData } from "./FieldsForm";

import { Button, Table } from "react-bootstrap";

interface Category {
  name: string;
}

export default function FieldsList() {
  const [fields, setFields] = useState<FieldData[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingField, setEditingField] = useState<number | null>(null);

  useEffect(() => {
    const storedFields: FieldData[] = JSON.parse(localStorage.getItem("fields") || "[]");
    setFields(storedFields);

    const storedCategories: Category[] = JSON.parse(localStorage.getItem("categories") || "[]");
    setCategories(storedCategories.map((c) => c.name)); // only category names
  }, []);

  const handleSave = (field: FieldData) => {
    let updatedFields: FieldData[];
    if (editingField !== null) {
      updatedFields = fields.map((f, idx) => (idx === editingField ? field : f));
    } else {
      updatedFields = [...fields, field];
    }
    setFields(updatedFields);
    localStorage.setItem("fields", JSON.stringify(updatedFields));
    setShowForm(false);
    setEditingField(null);
  };

  const handleEdit = (idx: number) => {
    setEditingField(idx);
    setShowForm(true);
  };

  const handleDelete = (idx: number) => {
    if (window.confirm("Are you sure you want to delete this field?")) {
      const updatedFields = fields.filter((_, i) => i !== idx);
      setFields(updatedFields);
      localStorage.setItem("fields", JSON.stringify(updatedFields));
    }
  };

  return (
    <div className="container mt-4">
      <h3>Fields</h3>

      {!showForm && (
        <>
          <Button
            className="mb-3"
            onClick={() => setShowForm(true)}
            disabled={categories.length === 0}
          >
            Add Field
          </Button>
          {categories.length === 0 && (
            <p className="text-danger">Add a category first to create fields.</p>
          )}
        </>
      )}

      {showForm && (
        <div className="mb-4 p-3 border rounded">
          <FieldsForm
            onSave={handleSave}
            categories={categories}
            initialData={
              editingField !== null
                ? { ...fields[editingField], required: fields[editingField].required ?? false, timezone: fields[editingField].timezone ?? false }
                : undefined
            }
          />
        </div>
      )}

      <Table striped bordered hover>
        <thead className="table-dark">
          <tr>
            <th>Category</th>
            <th>Field Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {fields.length === 0 ? (
            <tr>
              <td colSpan={3} className="text-center text-muted">
                No fields added
              </td>
            </tr>
          ) : (
            fields.map((f, idx) => (
              <tr key={idx}>
                <td>{f.category}</td>
                <td>{f.name}</td>
                <td>
                  <Button
                    size="sm"
                    variant="primary"
                    className="me-2"
                    onClick={() => handleEdit(idx)}
                  >
                    <i className="bi bi-pencil-square">Edit</i>
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete(idx)}
                  >
                    <i className="bi bi-trash">Delete</i>
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </div>
  );
}
