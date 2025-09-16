interface ToolbarProps {
  onSave: () => void;
  onPreview: () => void;
}

export default function Toolbar({ onSave, onPreview }: ToolbarProps) {
  return (
    <div
      style={{
        position: "absolute",
        top: "10px",
        right: "10px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      <button
        onClick={onSave}
        style={{
          background: "#16a34a",
          color: "white",
          padding: "8px 16px",
          borderRadius: "6px",
        }}
      >
        Save Template
      </button>
      <button
        onClick={onPreview}
        style={{
          background: "#2563eb",
          color: "white",
          padding: "8px 16px",
          borderRadius: "6px",
        }}
      >
        Preview PDF
      </button>
    </div>
  );
}
