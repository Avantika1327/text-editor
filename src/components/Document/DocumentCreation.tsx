import { useState, useEffect } from "react";

function readLS(key: string) {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch (e) {
    return [];
  }
}

export default function DocumentCreation() {
 
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

  const [availableHeaders, setAvailableHeaders] = useState<any[]>([]);
  const [availableFooters, setAvailableFooters] = useState<any[]>([]);
  const [selectedHeader, setSelectedHeader] = useState<string | null>(null);
  const [selectedFooter, setSelectedFooter] = useState<string | null>(null);

  const [dateValue, setDateValue] = useState("");
  const [timeValue, setTimeValue] = useState("");
  const [preparedBy, setPreparedBy] = useState("");
  const [quantityPrepared, setQuantityPrepared] = useState("");

  useEffect(() => {
    setAvailableHeaders(readLS("grapes_templates_v1"));
    setAvailableFooters(readLS("grapes_templates_v1"));
  }, []);
const handleSave = () => {
  const payload = {
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
  };

  localStorage.setItem("document_meta", JSON.stringify(payload)); // 🔹 save meta
  alert("✅ Document saved (demo only)");
};


  const getSelectedHeaderHtml = () => {
    const h = availableHeaders.find((x) => x.id === selectedHeader);
    return h ? { __html: `<style>${h.css}</style>${h.html}` } : null;
  };

  const getSelectedFooterHtml = () => {
    const f = availableFooters.find((x) => x.id === selectedFooter);
    return f ? { __html: `<style>${f.css}</style>${f.html}` } : null;
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>📄 Create Document</h2>

      <div style={styles.grid}>
        <Input label="Lab Name" value={labName} onChange={setLabName} />
        <Input label="Lab ID" value={labId} onChange={setLabId} />
        <Input label="Location" value={location} onChange={setLocation} />
        <Input label="Location ID" value={locationId} onChange={setLocationId} />
        <Input label="Department" value={department} onChange={setDepartment} />
        <Input
          label="Department ID"
          value={departmentId}
          onChange={setDepartmentId}
        />

   
        <div style={styles.field}>
          <label style={styles.label}>Category:</label>
          <select
            style={styles.textInput}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="SOP">SOP</option>
            <option value="WI">WI</option>
            <option value="FORM">FORM</option>
            <option value="SPEC">SPEC</option>
            <option value="REPORT">REPORT</option>
          </select>
        </div>

        <Input
          label="Document Name"
          value={documentName}
          onChange={setDocumentName}
        />
      </div>

     

      <div style={styles.field}>
        <label style={styles.label}>Header:</label>
        <input
          type="checkbox"
          checked={headerEnabled}
          onChange={(e) => setHeaderEnabled(e.target.checked)}
        />
        <span style={{ marginLeft: 8 }}>{headerEnabled ? "Yes" : "No"}</span>

        {headerEnabled && (
          <>
            <select
              style={styles.textInput}
              value={selectedHeader || ""}
              onChange={(e) => setSelectedHeader(e.target.value)}
            >
              <option value="">-- Select Header --</option>
              {availableHeaders.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name || "Untitled Header"}
                </option>
              ))}
            </select>

            {selectedHeader && (
              <div
                style={styles.previewBox}
                dangerouslySetInnerHTML={getSelectedHeaderHtml() || undefined}
              />
            )}
          </>
        )}
      </div>

    
      <div style={styles.field}>
        <label style={styles.label}>Footer:</label>
        <input
          type="checkbox"
          checked={footerEnabled}
          onChange={(e) => setFooterEnabled(e.target.checked)}
        />
        <span style={{ marginLeft: 8 }}>{footerEnabled ? "Yes" : "No"}</span>

        {footerEnabled && (
          <>
            <select
              style={styles.textInput}
              value={selectedFooter || ""}
              onChange={(e) => setSelectedFooter(e.target.value)}
            >
              <option value="">-- Select Footer --</option>
              {availableFooters.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name || "Untitled Footer"}
                </option>
              ))}
            </select>

            {selectedFooter && (
              <div
                style={styles.previewBox}
                dangerouslySetInnerHTML={getSelectedFooterHtml() || undefined}
              />
            )}
          </>
        )}
      </div>

   
      <Input label="Date" type="date" value={dateValue} onChange={setDateValue} />
      <Input label="Time" type="time" value={timeValue} onChange={setTimeValue} />
      <Input label="Prepared By" value={preparedBy} onChange={setPreparedBy} />
      <Input
        label="Quantity Prepared"
        type="number"
        value={quantityPrepared}
        onChange={setQuantityPrepared}
      />

      <button onClick={handleSave} style={styles.saveButton}>
        💾 Save Document
      </button>
    </div>
  );
}

function Input({ label, value, onChange, type = "text" }) {
  return (
    <div style={styles.field}>
      <label style={styles.label}>{label}:</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={styles.textInput}
      />
    </div>
  );
}

const styles: Record<string, any> = {
  container: {
    maxWidth: "700px",
    margin: "20px auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    background: "#fff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  heading: { textAlign: "center", marginBottom: "20px" },
  field: { marginBottom: "15px" },
  label: { display: "block", fontWeight: 600, marginBottom: "6px" },
  textInput: {
    width: "100%",
    padding: "8px",
    border: "1px solid #ccc",
    borderRadius: "6px",
  },
  saveButton: {
    width: "100%",
    padding: "10px",
    background: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  previewBox: {
    border: "1px dashed #aaa",
    padding: "10px",
    marginTop: "10px",
    background: "#fafafa",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "10px",
    marginBottom: "15px",
  },
};
