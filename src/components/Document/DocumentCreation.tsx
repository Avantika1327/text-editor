import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createDocument } from "../../utils/documentStorage";
import { v4 as uuidv4 } from "uuid";
import type { TemplateItem } from "../../utils/templateStorage";

function readLS(key: string) {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch (e) {
    return [];
  }
}

export default function DocumentCreation() {
  const navigate = useNavigate();

  const [labName, setLabName] = useState("");
  const [labId, setLabId] = useState("");
  const [location, setLocation] = useState("");
  const [locationId, setLocationId] = useState("");
  const [department, setDepartment] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [category, setCategory] = useState("SOP");
  const [documentName, setDocumentName] = useState("");

  const [headerEnabled, setHeaderEnabled] = useState(true);
  const [footerEnabled, setFooterEnabled] = useState(true);

  const [availableHeaders, setAvailableHeaders] = useState<TemplateItem[]>([]);
  const [availableFooters, setAvailableFooters] = useState<TemplateItem[]>([]);
  const [selectedHeader, setSelectedHeader] = useState<string | null>(null);
  const [selectedFooter, setSelectedFooter] = useState<string | null>(null);

  const [dateValue, setDateValue] = useState("");
  const [timeValue, setTimeValue] = useState("");
  const [preparedBy, setPreparedBy] = useState("");
  const [quantityPrepared, setQuantityPrepared] = useState("");

  useEffect(() => {
    const allTemplates = readLS("grapes_templates_v1") as TemplateItem[];
    setAvailableHeaders(allTemplates.filter(t => t.type === "header"));
    setAvailableFooters(allTemplates.filter(t => t.type === "footer"));
  }, []);

  const handleSave = () => {
    const payload = {
      id: uuidv4(),
      meta: {
        labName,
        labId,
        location,
        locationId,
        department,
        departmentId,
        category,
        documentName,
        header: headerEnabled ? selectedHeader : null,
        footer: footerEnabled ? selectedFooter : null,
        dateValue,
        timeValue,
        preparedBy,
        quantityPrepared,
      },
      html: "",
      css: "",
      archived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    createDocument(payload);
    navigate("/document-editor", { state: { documentId: payload.id } });
  };

  const getSelectedTemplateHtml = (templateId: string | null) => {
    if (!templateId) return "";
    const t = [...availableHeaders, ...availableFooters].find(x => x.id === templateId);
    if (!t) return "";
    return `<html><head><style>${t.css}</style></head><body>${t.html}</body></html>`;
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Create New Document</h2>

      <div style={styles.grid}>
        <Input label="Lab Name" value={labName} onChange={setLabName} />
        <Input label="Lab ID" value={labId} onChange={setLabId} />
        <Input label="Location" value={location} onChange={setLocation} />
        <Input label="Location ID" value={locationId} onChange={setLocationId} />
        <Input label="Department" value={department} onChange={setDepartment} />
        <Input label="Department ID" value={departmentId} onChange={setDepartmentId} />
        <div style={styles.field}>
          <label style={styles.label}>Category:</label>
          <select style={styles.textInput} value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="SOP">SOP</option>
            <option value="WI">WI</option>
            <option value="FORM">FORM</option>
            <option value="SPEC">SPEC</option>
            <option value="REPORT">REPORT</option>
          </select>
        </div>
        <Input label="Document Name" value={documentName} onChange={setDocumentName} />
      </div>

      <Card title="Header Settings">
        <div style={styles.checkboxRow}>
          <input type="checkbox" checked={headerEnabled} onChange={(e) => setHeaderEnabled(e.target.checked)} />
          <span style={{ marginLeft: 8 }}>{headerEnabled ? "Enabled" : "Disabled"}</span>
        </div>
        {headerEnabled && (
          <>
            <select style={styles.textInput} value={selectedHeader || ""} onChange={(e) => setSelectedHeader(e.target.value)}>
              <option value="">-- Select Header --</option>
              {availableHeaders.map(h => <option key={h.id} value={h.id}>{h.name || "Untitled Header"}</option>)}
            </select>
            {selectedHeader && (
              <iframe
                style={styles.previewIframe}
                srcDoc={getSelectedTemplateHtml(selectedHeader)}
                title="Header Preview"
              />
            )}
          </>
        )}
      </Card>

      <Card title="Footer Settings">
        <div style={styles.checkboxRow}>
          <input type="checkbox" checked={footerEnabled} onChange={(e) => setFooterEnabled(e.target.checked)} />
          <span style={{ marginLeft: 8 }}>{footerEnabled ? "Enabled" : "Disabled"}</span>
        </div>
        {footerEnabled && (
          <>
            <select style={styles.textInput} value={selectedFooter || ""} onChange={(e) => setSelectedFooter(e.target.value)}>
              <option value="">-- Select Footer --</option>
              {availableFooters.map(f => <option key={f.id} value={f.id}>{f.name || "Untitled Footer"}</option>)}
            </select>
            {selectedFooter && (
              <iframe
                style={styles.previewIframe}
                srcDoc={getSelectedTemplateHtml(selectedFooter)}
                title="Footer Preview"
              />
            )}
          </>
        )}
      </Card>

      <div style={styles.grid}>
        <Input label="Date" type="date" value={dateValue} onChange={setDateValue} />
        <Input label="Time" type="time" value={timeValue} onChange={setTimeValue} />
        <Input label="Prepared By" value={preparedBy} onChange={setPreparedBy} />
        <Input label="Quantity Prepared" type="number" value={quantityPrepared} onChange={setQuantityPrepared} />
      </div>

      <button onClick={handleSave} style={styles.saveButton}> Save Document</button>
    </div>
  );
}

function Card({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div style={styles.card}>
      <h3 style={styles.cardTitle}>{title}</h3>
      <div>{children}</div>
    </div>
  );
}

function Input({ label, value, onChange, type = "text" }: any) {
  return (
    <div style={styles.field}>
      <label style={styles.label}>{label}:</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} style={styles.textInput} />
    </div>
  );
}

const styles: Record<string, any> = {
  container: { maxWidth: "750px", margin: "30px auto", padding: "25px", borderRadius: "12px", background: "#f9f9f9", boxShadow: "0 5px 20px rgba(0,0,0,0.1)", fontFamily: "Arial, sans-serif" },
  heading: { textAlign: "center", marginBottom: "25px", color: "#333", fontSize: "1.8rem" },
  grid: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "15px", marginBottom: "20px" },
  field: { marginBottom: "12px" },
  label: { display: "block", fontWeight: 600, marginBottom: "6px", color: "#555" },
  textInput: { width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "8px", fontSize: "0.95rem", transition: "border 0.2s" },
  saveButton: { width: "100%", padding: "12px", background: "linear-gradient(90deg, #4e9af1, #007bff)", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "bold", fontSize: "1rem", cursor: "pointer" },
  previewIframe: { width: "100%", height: "auto", minHeight: "200px", border: "1px dashed #bbb", marginTop: "10px", borderRadius: "6px", background: "#fff" },
  card: { padding: "15px", borderRadius: "10px", background: "#fff", boxShadow: "0 2px 12px rgba(0,0,0,0.08)", marginBottom: "20px" },
  cardTitle: { marginBottom: "10px", color: "#00b7ffff", fontWeight: 600 },
  checkboxRow: { display: "flex", alignItems: "center", marginBottom: "10px" },
};
