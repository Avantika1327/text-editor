import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import GrapesEditor from "../TemplateBuilder/GrapesEditor";
import Toolbar from "../TemplateBuilder/Toolbar";
import { getTemplate } from "../../utils/templateStorage";
import { getDocument, updateDocument } from "../../utils/documentStorage";

export default function DocumentEditor() {
  const [editor, setEditor] = useState<any>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [applyByChecked, setApplyByChecked] = useState(false);
  const [applyDate, setApplyDate] = useState("");
  const location = useLocation();
  const params = useParams();
  const navigate = useNavigate();

  const docId = location.state?.documentId || params.id;
   const replacePlaceholders = (html: string, meta: any) => {
  if (!html) return "";
  Object.keys(meta).forEach(key => {
    const value = meta[key];
    if (value !== undefined && value !== "") {
      html = html.replaceAll(`{{${key}}}`, value);
    } else {
      html = html.replaceAll(`{{${key}}}`, `{{${key}}}`);
    }
  });
  return html;
};


 useEffect(() => {
  const metaDoc = getDocument(docId);
  if (!metaDoc || !editor) return;

  const meta = metaDoc.meta;

  const lockComponent = (cmp: any, options: any = {}) => {
    if (!cmp) return;
    cmp.set({
      editable: options.editable ?? false,
      removable: false,
      copyable: false,
      draggable: options.draggable ?? false,
      highlightable: false,
    });
    cmp.get("components").forEach((child: any) => lockComponent(child, options));
  };

 
  if (meta.header) {
    const headerTpl = getTemplate(meta.header);
    if (headerTpl) {
      const headerHtml = replacePlaceholders(headerTpl.html, meta);
      const headerComp = editor.addComponents(
        `<div id="fixed-header">${headerHtml}</div>`,
        { at: 0 }
      )[0];
      editor.addStyle(headerTpl.css);

  
      lockComponent(headerComp, { editable: false, draggable: false });
    }
  }

 
  if (meta.footer) {
    const footerTpl = getTemplate(meta.footer);
    if (footerTpl) {
      const footerHtml = replacePlaceholders(footerTpl.html, meta);
      const footerComp = editor.addComponents(
        `<div id="fixed-footer">${footerHtml}</div>`
      )[0];
      editor.addStyle(footerTpl.css);

      lockComponent(footerComp, { editable: true, draggable: false });
    }
  }

 
  editor.BlockManager.remove("custom-header");
  editor.BlockManager.remove("custom-footer");

  
  if (metaDoc.html) {
    editor.setComponents(metaDoc.html);
    editor.setStyle(metaDoc.css);
  }
}, [editor, docId]);


  const handleSaveClick = () => setShowAlert(true);

  const handleConfirmSave = () => {
    if (!editor || !docId) return;

    updateDocument(docId, {
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
      <GrapesEditor onInit={setEditor} docData={getDocument(docId)?.meta} />
      <Toolbar onSave={handleSaveClick} />

      {showAlert && (
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
            <button onClick={() => setShowAlert(false)} style={{ marginRight: 10 }}>
              Cancel
            </button>
            <button onClick={handleConfirmSave}>Save</button>
          </div>
        </div>
      )}
    </div>
  );
}
