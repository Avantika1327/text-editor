import React, { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";

// Types
interface ClauseField {
  field: string;
  category: string;
}

interface Clause {
  title: string;
  note?: string;
  fields?: ClauseField[];
  children?: Clause[];
}

interface ClauseItemProps {
  clause: Clause;
}

interface LabFormData {
  labId: string;
  labName: string;
  address: string;
  contactEmail: string;
  contactPhone: string;
  timeZone: string;
  logo: File | null;
  accreditation: string;
  labType: string;
  department: string;
  workingHoursStart: string;
  workingHoursEnd: string;
  capacity: string;
  specialFacilities: string;
  status: string;
  notes: string;
}

// ClauseItem Component
const ClauseItem: React.FC<ClauseItemProps> = ({ clause }) => {
  const [open, setOpen] = useState(false);

  const isExpandable =
    (clause.children && clause.children.length > 0) ||
    (clause.fields && clause.fields.length > 0) ||
    clause.note;

  return (
    <div
      className="clause-item"
      style={{
        marginLeft: "10px",
        marginTop: "12px",
        padding: "10px",
        borderLeft: "3px solid #e9ecef",
      }}
    >
      <div className="d-flex align-items-center">
        <button
          type="button"
          onClick={() => isExpandable && setOpen(!open)}
          className="clause-toggle-btn"
          style={{
            marginRight: "12px",
            border: "1px solid #060606ff",
            borderRadius: "50%",
            background: isExpandable ? "#f8f9fa" : "#f1f3f5",
            color: isExpandable ? "#070707ff" : "#adb5bd",
            cursor: isExpandable ? "pointer" : "not-allowed",
            width: "30px",
            height: "30px",
            fontWeight: "bold",
            fontSize: "16px",
            lineHeight: "20px",
            textAlign: "center",
            transition: "all 0.2s ease",
            flexShrink: 0,
          }}
        >
          {isExpandable ? (open ? "−" : "+") : "•"}
        </button>

        <Form.Check
          type="checkbox"
          id={clause.title}
          label={<span style={{ fontWeight: 600, color: "#2c3e50" }}>{clause.title}</span>}
          defaultChecked
          className="flex-grow-1"
        />
      </div>

      {open && (
        <div className="ms-4 mt-2">
          {clause.note && (
            <div
              className="clause-note"
              style={{
                color: "#6c757d",
                fontStyle: "italic",
                padding: "8px 12px",
                backgroundColor: "#f8f9fa",
                borderRadius: "6px",
                marginBottom: "10px",
                borderLeft: "3px solid #ffc107",
              }}
            >
              <strong>Note:</strong> {clause.note}
            </div>
          )}

         {(clause.fields ?? []).length > 0 && (
  <Card className="mb-3" style={{ border: "1px solid #e9ecef" }}>
    <Card.Body className="py-2">
      {(clause.fields ?? []).map((f: ClauseField, idx: number) => (
        <Form.Check
          key={idx}
          type="checkbox"
          id={`${clause.title}-field-${idx}`}
          label={`${f.field} ${f.category}`}
          defaultChecked
          className="mb-1"
        />
      ))}
    </Card.Body>
  </Card>
)}


          {clause.children?.map((child: Clause, idx: number) => (
            <ClauseItem key={idx} clause={child} />
          ))}
        </div>
      )}
    </div>
  );
};

// LabForm Component
const LabForm: React.FC = () => {
  const [accordionData, setAccordionData] = useState<Clause[]>([]);

  useEffect(() => {
    fetch("/json/clause.json")
      .then((res) => res.json())
      .then((data: Clause[]) => setAccordionData(data))
      .catch((err) => console.error(err));
  }, []);

  const [formData, setFormData] = useState<LabFormData>({
    labId: "",
    labName: "",
    address: "",
    contactEmail: "",
    contactPhone: "",
    timeZone: "",
    logo: null,
    accreditation: "",
    labType: "",
    department: "",
    workingHoursStart: "",
    workingHoursEnd: "",
    capacity: "",
    specialFacilities: "",
    status: "Active",
    notes: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    alert("Lab form submitted");
  };

  return (
    <Container className="my-4">
      <Row className="justify-content-center">
        <Col lg={10}>
          <Card className="border-0 shadow-lg overflow-hidden">
            <Card.Header className="bg-dark text-white py-3">
              <h2 className="mb-0 fw-bold">Create Lab</h2>
            </Card.Header>

            <Card.Body className="p-4">
              <Form onSubmit={handleSubmit}>
                {/* Basic Info */}
                <div className="mb-4">
                  <h4 className="mb-3">Basic Information</h4>
                  <Row>
                    <Col md={6} className="mb-3">
                      <Form.Group controlId="labId">
                        <Form.Label>Lab ID <span className="text-danger">*</span></Form.Label>
                        <Form.Control type="text" name="labId" value={formData.labId} onChange={handleChange} placeholder="Enter Lab ID" required />
                      </Form.Group>
                    </Col>

                    <Col md={6} className="mb-3">
                      <Form.Group controlId="labName">
                        <Form.Label>Lab Name <span className="text-danger">*</span></Form.Label>
                        <Form.Control type="text" name="labName" value={formData.labName} onChange={handleChange} placeholder="Enter Lab Name" required />
                      </Form.Group>
                    </Col>

                    <Col md={6} className="mb-3">
                      <Form.Group controlId="labType">
                        <Form.Label>Lab Type</Form.Label>
                        <Form.Select name="labType" value={formData.labType} onChange={handleChange}>
                          <option value="">Select Lab Type</option>
                          <option value="Research">Research</option>
                          <option value="Testing">Testing</option>
                          <option value="Teaching">Teaching</option>
                          <option value="Clinical">Clinical</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>

                    <Col md={6} className="mb-3">
                      <Form.Group controlId="department">
                        <Form.Label>Department</Form.Label>
                        <Form.Control type="text" name="department" value={formData.department} onChange={handleChange} placeholder="Enter Department" />
                      </Form.Group>
                    </Col>

                    <Col md={12} className="mb-3">
                      <Form.Group controlId="address">
                        <Form.Label>Address <span className="text-danger">*</span></Form.Label>
                        <Form.Control as="textarea" rows={2} name="address" value={formData.address} onChange={handleChange} placeholder="Enter Lab Address" required />
                      </Form.Group>
                    </Col>
                  </Row>
                </div>

                {/* Contact Info */}
                <div className="mb-4">
                  <h4 className="mb-3">Contact Information</h4>
                  <Row>
                    <Col md={6} className="mb-3">
                      <Form.Group controlId="contactEmail">
                        <Form.Label>Contact Email <span className="text-danger">*</span></Form.Label>
                        <Form.Control type="email" name="contactEmail" value={formData.contactEmail} onChange={handleChange} placeholder="Enter Email" required />
                      </Form.Group>
                    </Col>

                    <Col md={6} className="mb-3">
                      <Form.Group controlId="contactPhone">
                        <Form.Label>Contact Phone <span className="text-danger">*</span></Form.Label>
                        <Form.Control type="text" name="contactPhone" value={formData.contactPhone} onChange={handleChange} placeholder="Enter Phone" required />
                      </Form.Group>
                    </Col>

                    <Col md={6} className="mb-3">
                      <Form.Group controlId="logo">
                        <Form.Label>Logo</Form.Label>
                        <Form.Control type="file" name="logo" onChange={handleChange} accept="image/*" />
                      </Form.Group>
                    </Col>
                  </Row>
                </div>

                {/* Operational Details */}
                <div className="mb-4">
                  <h4 className="mb-3">Operational Details</h4>
                  <Row>
                    <Col md={6} className="mb-3">
                      <Form.Group controlId="workingHoursStart">
                        <Form.Label>Working Hours Start <span className="text-danger">*</span></Form.Label>
                        <Form.Control type="time" name="workingHoursStart" value={formData.workingHoursStart} onChange={handleChange} required />
                      </Form.Group>
                    </Col>

                    <Col md={6} className="mb-3">
                      <Form.Group controlId="workingHoursEnd">
                        <Form.Label>Working Hours End <span className="text-danger">*</span></Form.Label>
                        <Form.Control type="time" name="workingHoursEnd" value={formData.workingHoursEnd} onChange={handleChange} required />
                      </Form.Group>
                    </Col>

                    <Col md={6} className="mb-3">
                      <Form.Group controlId="capacity">
                        <Form.Label>Capacity / Equipment Count</Form.Label>
                        <Form.Control type="number" name="capacity" value={formData.capacity} onChange={handleChange} placeholder="Enter Capacity" min={1} />
                      </Form.Group>
                    </Col>

                    <Col md={6} className="mb-3">
                      <Form.Group controlId="status">
                        <Form.Label>Status</Form.Label>
                        <Form.Select name="status" value={formData.status} onChange={handleChange}>
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                          <option value="Under Maintenance">Under Maintenance</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                </div>

                {/* Additional Info */}
                <div className="mb-4">
                  <h4 className="mb-3">Additional Information</h4>
                  <Row>
                    <Col md={6} className="mb-3">
                      <Form.Group controlId="accreditation">
                        <Form.Label>Accreditation Details</Form.Label>
                        <Form.Control type="text" name="accreditation" value={formData.accreditation} onChange={handleChange} placeholder="Enter Accreditation Details" />
                      </Form.Group>
                    </Col>

                    <Col md={6} className="mb-3">
                      <Form.Group controlId="specialFacilities">
                        <Form.Label>Special Facilities</Form.Label>
                        <Form.Control type="text" name="specialFacilities" value={formData.specialFacilities} onChange={handleChange} placeholder="e.g., Cleanroom, BSL-2" />
                      </Form.Group>
                    </Col>

                    <Col md={12} className="mb-3">
                      <Form.Group controlId="notes">
                        <Form.Label>Notes / Remarks</Form.Label>
                        <Form.Control as="textarea" rows={3} name="notes" value={formData.notes} onChange={handleChange} placeholder="Any additional notes" />
                      </Form.Group>
                    </Col>
                  </Row>
                </div>

                {/* Clauses Section */}
                <div className="mb-4">
                  <h4 className="mb-3">Clauses & Compliance</h4>
                  <Card className="border-0 bg-light">
                    <Card.Body className="p-3">
                      {accordionData.map((clause, idx) => (
                        <ClauseItem key={idx} clause={clause} />
                      ))}
                    </Card.Body>
                  </Card>
                </div>

                {/* Submit Buttons */}
                <div className="text-end mt-4">
                  <Button variant="outline-secondary" className="me-2" type="button">Cancel</Button>
                  <Button variant="primary" type="submit">
                    <i className="fas fa-plus-circle me-2"></i>
                    Create Lab
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LabForm;
