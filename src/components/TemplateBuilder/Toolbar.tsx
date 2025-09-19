import { useState, useEffect } from "react";

interface ToolbarProps {
  onSave: (name: string, saveType: "normal" | "draft" | "archive") => void;
  onPreview?: () => void;
  initialName?: string; // 👈 old name prop
}

export default function Toolbar({ onSave, onPreview, initialName }: ToolbarProps) {
  const [showPopup, setShowPopup] = useState(false);
  const [templateName, setTemplateName] = useState(initialName || "");

  // 👇 ensure when editing, input gets old value
  useEffect(() => {
    if (initialName) setTemplateName(initialName);
  }, [initialName]);

  const handleSave = (type: "normal" | "draft" | "archive") => {
    if (!templateName.trim()) {
      alert("Please enter a template name");
      return;
    }
    onSave(templateName, type);
    setShowPopup(false);
  };

  return (
    <div>
      {/* Top-right buttons */}
      <div
        style={{
          position: "absolute",
          top: 20,
          right: 0,
          display: "flex",
          gap: 12,
          flexDirection: "column",
          alignItems: "flex-end",
          zIndex: 100,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 12,
            alignItems: "center",
            flexDirection: "column",
            padding: "12px 16px",
            borderRadius: 12,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <input
            type="text"
            placeholder="Template Name"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              border: "1px solid #e2e8f0",
              fontSize: "14px",
              minWidth: "200px",
              outline: "none",
              transition: "border-color 0.2s",
              background: "#f8fafc",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#3b82f6")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#e2e8f0")}
          />

          <button
            onClick={() =>
              templateName.trim()
                ? setShowPopup(true)
                : alert("Please enter a template name")
            }
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              background: "#16a34a",
              color: "white",
              border: "none",
              fontWeight: 500,
              fontSize: "14px",
              cursor: "pointer",
              transition: "background-color 0.2s",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "#15803d")}
            onMouseOut={(e) => (e.currentTarget.style.background = "#16a34a")}
          >
            Save Template
          </button>

          <button
            onClick={onPreview}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              background: "#2563eb",
              color: "white",
              border: "none",
              fontWeight: 500,
              fontSize: "14px",
              cursor: "pointer",
              transition: "background-color 0.2s",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "#1d4ed8")}
            onMouseOut={(e) => (e.currentTarget.style.background = "#2563eb")}
          >
            Preview
          </button>
        </div>
      </div>

      {/* Save Options Popup */}
      {showPopup && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            animation: "fadeIn 0.2s ease-out",
          }}
          onClick={() => setShowPopup(false)}
        >
          <div
            style={{
              background: "white",
              padding: "24px",
              borderRadius: "16px",
              minWidth: "320px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
              animation: "scaleIn 0.2s ease-out",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: "0 0 12px 0", fontSize: "18px", color: "#1e293b" }}>
              Save Options
            </h3>

            <button
              style={{
                padding: "12px 16px",
                color: "white",
                borderRadius: 8,
                background: "#16a34a",
                border: "none",
                fontWeight: 500,
                fontSize: "14px",
                cursor: "pointer",
              }}
              onClick={() => handleSave("normal")}
            >
              Save Template
            </button>

            <button
              style={{
                padding: "12px 16px",
                color: "white",
                borderRadius: 8,
                background: "#f59e0b",
                border: "none",
                fontWeight: 500,
                fontSize: "14px",
                cursor: "pointer",
              }}
              onClick={() => handleSave("draft")}
            >
              Save as Draft
            </button>

            <button
              style={{
                padding: "12px 16px",
                color: "white",
                borderRadius: 8,
                background: "#6b7280",
                border: "none",
                fontWeight: 500,
                fontSize: "14px",
                cursor: "pointer",
              }}
              onClick={() => handleSave("archive")}
            >
              Save as Archive
            </button>

            <div
              style={{ height: "1px", background: "#e2e8f0", margin: "12px 0" }}
            ></div>

            <button
              style={{
                padding: "10px 16px",
                color: "#64748b",
                borderRadius: 8,
                background: "transparent",
                border: "1px solid #e2e8f0",
                fontWeight: 500,
                fontSize: "14px",
                cursor: "pointer",
              }}
              onClick={() => setShowPopup(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes scaleIn {
            from { transform: scale(0.95); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
        `}
      </style>
    </div>
  );
}
