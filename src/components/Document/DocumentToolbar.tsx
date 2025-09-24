import { useState } from "react";

interface ToolbarProps {
  onSave: (type: "normal" | "draft" | "archive") => void;
  onPreview?: () => void;
}

export default function DocumentToolbar({ onSave, onPreview }: ToolbarProps) {
  const [showPopup, setShowPopup] = useState(false);

  const handleSave = (type: "normal" | "draft" | "archive") => {
    onSave(type);
    setShowPopup(false);
  };

  return (
    <div>
      <div
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          display: "flex",
          gap: 12,
          flexDirection: "column",
          alignItems: "flex-end",
          zIndex: 100,
        }}
      >
        <button
          onClick={() => setShowPopup(true)}
          style={{
            padding: "8px 16px",
            borderRadius: 8,
            background: "#16a34a",
            color: "white",
            border: "none",
            fontWeight: 500,
            fontSize: "14px",
            cursor: "pointer",
          }}
        >
          Save Document
        </button>

        {onPreview && (
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
            }}
          >
            Preview
          </button>
        )}
      </div>

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
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: 0, fontSize: "18px", color: "#1e293b" }}>
              Save Options
            </h3>

            <button
              style={{
                padding: "12px 16px",
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
              }}
              onClick={() => handleSave("normal")}
            >
              Save Document
            </button>

            <button
              style={{
                padding: "12px 16px",
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
              }}
              onClick={() => handleSave("draft")}
            >
              Save as Draft
            </button>

            <button
              style={{
                padding: "12px 16px",
                borderRadius: 8,
                background: "#6b7280",
                color: "white",
                border: "none",
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
                borderRadius: 8,
                background: "transparent",
                border: "1px solid #e2e8f0",
                cursor: "pointer",
              }}
              onClick={() => setShowPopup(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
