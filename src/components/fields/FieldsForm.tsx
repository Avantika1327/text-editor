// src/fields/FieldsForm.tsx
import React, { useState, useEffect, type FormEvent } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";

export interface FieldData {
  category: string;
  name: string;
  required?: boolean;  // optional
  timezone?: boolean;  // optional
}

interface FieldsFormProps {
  onSave: (field: FieldData) => void;
  categories: string[];
  initialData?: FieldData;
}

const FieldsForm: React.FC<FieldsFormProps> = ({ onSave, categories, initialData }) => {
  const [category, setCategory] = useState(initialData?.category ?? "");
  const [name, setName] = useState(initialData?.name ?? "");
  const [required, setRequired] = useState(initialData?.required ?? false);
  const [timezone, setTimezone] = useState(initialData?.timezone ?? false);

  useEffect(() => {
    if (initialData) {
      setCategory(initialData.category);
      setName(initialData.name);
      setRequired(initialData.required ?? false);
      setTimezone(initialData.timezone ?? false);
    } else {
      setCategory("");
      setName("");
      setRequired(false);
      setTimezone(false);
    }
  }, [initialData]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!category.trim() || !name.trim()) {
      alert("Please fill all required fields!");
      return;
    }

    onSave({ category, name, required, timezone });

    // reset after save
    setCategory("");
    setName("");
    setRequired(false);
    setTimezone(false);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">Select Category</option>
              {categories.map((cat, idx) => (
                <option key={idx} value={cat}>
                  {cat}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Field Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter field name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3 form-check">
            <Form.Check
              type="checkbox"
              label="Required"
              checked={required}
              onChange={(e) => setRequired(e.target.checked)}
            />
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-3 form-check">
            <Form.Check
              type="checkbox"
              label="Initial Timezone"
              checked={timezone}
              onChange={(e) => setTimezone(e.target.checked)}
            />
          </Form.Group>
        </Col>
      </Row>

      <Button variant="primary" type="submit">
        Save
      </Button>
    </Form>
  );
};

export default FieldsForm;
