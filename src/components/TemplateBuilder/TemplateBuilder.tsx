import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import GrapesEditor from "./GrapesEditor";
import Toolbar from "./Toolbar";
import { exportToPdf } from "./PdfUtils";

import { saveTemplate, getTemplate, generateId } from "../../utils/templateStorage";
import type { TemplateItem } from "../../utils/templateStorage";

export default function TemplateBuilder() {
  const [editor, setEditor] = useState<any>(null);
  const navigate = useNavigate();
  const { id } = useParams(); // जर edit करत असशील तर URL मधून id येईल

  // जर edit mode असेल तर जुना template load करायचा
  useEffect(() => {
    if (id && editor) {
      const template = getTemplate(id);
      if (template) {
        editor.setComponents(template.html);
        editor.setStyle(template.css);
      }
    }
  }, [id, editor]);

  const handleSave = () => {
    if (!editor) return;
    const html = editor.getHtml();
    const css = editor.getCss({ withMedia: true });
    const json = editor.getComponents();

    const now = new Date().toISOString();

    const template: TemplateItem = {
      id: id || generateId(), // नवीन असल्यास unique id
      name: `Template ${id || Date.now()}`, // default नाव
      html,
      css,
      json,
      createdAt: now,
      updatedAt: now,
      archived: false,
    };

    saveTemplate(template);

    alert("✅ Template Saved!");
    navigate("/"); // Save झाल्यावर List ला जा
  };

  const handlePreview = () => {
    if (!editor) return;
    const html = editor.getHtml();
    const css = editor.getCss({ withMedia: true });

    exportToPdf(html, css, {
      companyName: "Avantika Solutions",
      address: "Mumbai, India",
      email: "info@avantika.com",
      phone: "+91-9876543210",
      year: "2025",
      username: "Avantika",
      date: "10-09-2025",
      invoiceNumber: "INV-12345",
    });
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
      <GrapesEditor onInit={setEditor} />
      <Toolbar onSave={handleSave} onPreview={handlePreview} />
    </div>
  );
}
