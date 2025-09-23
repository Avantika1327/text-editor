// src/pages/documents/DocumentEditor.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import GrapesEditor from "../TemplateBuilder/GrapesEditor";
import Toolbar from "../TemplateBuilder/Toolbar";
import { getTemplate } from "../../utils/templateStorage";
import { getDocument, updateDocument } from "../../utils/documentStorage";

export default function DocumentEditor() {
  const { id } = useParams<{ id: string }>(); // id is string | undefined
  const navigate = useNavigate();

  const [editor, setEditor] = useState<any>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [applyByChecked, setApplyByChecked] = useState(false);
  const [applyDate, setApplyDate] = useState("");

  const metaDoc = id ? getDocument(id) : null;
  const isEditing = !!metaDoc; // true if editing an existing document

  // Redirect if id is missing
  useEffect(() => {
    if (!id) navigate("/document-list");
  }, [id, navigate]);

  useEffect(() => {
    if (!editor || !id || !metaDoc) return;

    // Pre-fill applyBy only if it exists in saved doc
    if (metaDoc.applyBy) {
      setApplyByChecked(true);
      setApplyDate(metaDoc.applyBy);
    }

    const meta = metaDoc.meta;

    const lockComponent = (cmp: any) => {
      if (!cmp) return;
      cmp.set({
        editable: false,
        removable: false,
        copyable: false,
        draggable: false,
        highlightable: false,
      });
      cmp.get("components").forEach((child: any) => lockComponent(child));
    };

    if (meta.header) {
      const headerTpl = getTemplate(meta.header);
      if (headerTpl) {
        const headerComp = editor.addComponents(
          `<div id="fixed-header">${headerTpl.html}</div>`,
          { at: 0 }
        )[0];
        editor.addStyle(headerTpl.css);
        lockComponent(headerComp);
      }
    }

    if (meta.footer) {
      const footerTpl = getTemplate(meta.footer);
      if (footerTpl) {
        const footerComp = editor.addComponents(
          `<div id="fixed-footer">${footerTpl.html}</div>`
        )[0];
        editor.addStyle(footerTpl.css);
        lockComponent(footerComp);
      }
    }

    editor.BlockManager.remove("custom-header");
    editor.BlockManager.remove("custom-footer");

    if (metaDoc.html) {
      editor.setComponents(metaDoc.html);
      editor.setStyle(metaDoc.css);
    }
  }, [editor, id, metaDoc]);

  const handleSaveClick = () => {
    if (isEditing) {
      // If editing existing document, save directly
      handleConfirmSave();
    } else {
      // If new document, show Apply By alert
      setShowAlert(true);
    }
  };

  const handleConfirmSave = () => {
    if (!editor || !id) return;

    updateDocument(id, {
      html: editor.getHtml(),
      css: editor.getCss(),
      applyBy: applyByChecked ? applyDate : null,
    });

    setShowAlert(false);
    alert("Document Saved!");
    navigate("/document-list");
  };

  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw" }}>
      <div
        id="blocks"
        style={{
          width: "250px",
          background: "#f7f7f7",
          padding: "10px",
          overflowY: "auto",
        }}
      />
      <GrapesEditor onInit={setEditor} docData={metaDoc?.meta} />
      <Toolbar onSave={handleSaveClick} />

      {!isEditing && showAlert && (
        <div
          style={{
            position: "fixed",
            top: "30%",
            left: "50%",
            transform: "translate(-50%, -30%)",
            background: "#fff",
            border: "1px solid #ccc",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.2)",
            zIndex: 9999,
            minWidth: "300px",
          }}
        >
          <h3>Save Document</h3>
          <div style={{ margin: "10px 0" }}>
            <label>
              <input
                type="checkbox"
                checked={applyByChecked}
                onChange={(e) => setApplyByChecked(e.target.checked)}
              />{" "}
              Apply By
            </label>
          </div>
          {applyByChecked && (
            <div style={{ marginBottom: "10px" }}>
              <input
                type="date"
                value={applyDate}
                onChange={(e) => setApplyDate(e.target.value)}
              />
            </div>
          )}
          <div style={{ textAlign: "right" }}>
            <button
              onClick={() => setShowAlert(false)}
              style={{ marginRight: 10 }}
            >
              Cancel
            </button>
            <button onClick={handleConfirmSave}>Save</button>
          </div>
        </div>
      )}
    </div>
  );
}
