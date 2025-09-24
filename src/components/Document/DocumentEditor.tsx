import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import GrapesEditor from "../TemplateBuilder/GrapesEditor";
import DocumentToolbar from "./DocumentToolbar";
import { getTemplate } from "../../utils/templateStorage";
import { getDocument, updateDocument } from "../../utils/documentStorage";

export default function DocumentEditor() {
  const [editor, setEditor] = useState<any>(null);
  const [applyByChecked, setApplyByChecked] = useState(false);
  const [applyDate, setApplyDate] = useState("");
  const location = useLocation();
  const params = useParams();
  const navigate = useNavigate();
  const docId = location.state?.documentId || params.id;

  useEffect(() => {
    const metaDoc = getDocument(docId);
    if (!metaDoc || !editor) return;
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
  }, [editor, docId]);

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

      <DocumentToolbar
        onSave={(type) => {
          if (!editor || !docId) return;

          if (applyByChecked && (!applyDate || applyDate.trim() === "")) {
            alert("⚠️ Please select a valid 'Apply By' date before saving!");
            return;
          }

          const isDraft = type === "draft";

          updateDocument(docId, {
            html: editor.getHtml(),
            css: editor.getCss(),
            applyBy: applyByChecked ? applyDate : null,
            draft: isDraft,
            archived: type === "archive",
          });

          alert("✅ Document Saved!");
          navigate("/document-list");
        }}
      />

      {/* Apply By Date */}
      <div
        style={{
          position: "fixed",
          top: 100,
          right: 20,
          background: "#fff",
          padding: "10px",
          borderRadius: 8,
          boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
          zIndex: 999,
        }}
      >
        <label>
          <input
            type="checkbox"
            checked={applyByChecked}
            onChange={(e) => setApplyByChecked(e.target.checked)}
          />{" "}
          Apply By
        </label>
        {applyByChecked && (
          <input
            type="date"
            value={applyDate}
            onChange={(e) => setApplyDate(e.target.value)}
          />
        )}
      </div>
    </div>
  );
}
