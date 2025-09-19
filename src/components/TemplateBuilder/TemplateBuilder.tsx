import { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import GrapesEditor from "./GrapesEditor";
import Toolbar from "./Toolbar";
import { exportToPdf } from "./PdfUtils";
import { saveTemplate, getTemplate, generateId } from "../../utils/templateStorage";
import type { TemplateItem } from "../../utils/templateStorage"; 

export default function TemplateBuilder() {
  const [editor, setEditor] = useState<any>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const [type, setType] = useState<"header" | "footer" | "generic" | undefined>(undefined);
  const [templateName, setTemplateName] = useState<string>("");

  // Load template if editing
  useEffect(() => {
    if (location.state?.auto) {
      setType(location.state.auto as "header" | "footer" | "generic");
    }
    if (id && editor) {
      const template = getTemplate(id);
      if (template) {
        editor.setComponents(template.html);
        editor.setStyle(template.css);
        setType(template.type || "generic");
        setTemplateName(template.name); // ✅ old name load
      }
    }
  }, [id, editor, location.state]);

  // Save handler
  const handleSave = (name: string, saveType: "normal" | "draft" | "archive") => {
    if (!editor) return;

    const html = editor.getHtml();
    const css = editor.getCss({ withMedia: true });
    const json = editor.getComponents();
    const now = new Date().toISOString();

    const template: TemplateItem = {
      id: id || generateId(),
      name: name && name.trim() ? name : `Template ${id || Date.now()}`, // ✅ from Toolbar
      type: type || "generic",
      html,
      css,
      json,
      createdAt: id ? getTemplate(id)?.createdAt || now : now,
      updatedAt: now,
      archived: saveType === "archive",
      metadata: { status: saveType === "draft" ? "draft" : "normal" },
    };

    saveTemplate(template);
    alert("✅ Template Saved!");
    navigate("/");
  };

  // Preview
  const handlePreview = async () => {
    if (!editor) return;
    const css = editor.getCss({ withMedia: true });
    const iframe = document.querySelector<HTMLIFrameElement>(".gjs-frame");
    if (!iframe) return;
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDoc) return;

    // Replace form elements for preview
    iframeDoc.querySelectorAll("select").forEach(s => {
      const span = document.createElement("span");
      span.style.fontWeight = "bold";
      span.textContent = (s as HTMLSelectElement).value || "(Not Selected)";
      s.replaceWith(span);
    });
    iframeDoc.querySelectorAll("input").forEach(i => {
      const span = document.createElement("span");
      span.style.fontWeight = "bold";
      span.textContent = (i as HTMLInputElement).value || (i as HTMLInputElement).placeholder || "";
      i.replaceWith(span);
    });
    iframeDoc.querySelectorAll("textarea").forEach(t => {
      const div = document.createElement("div");
      div.style.fontWeight = "bold";  
      div.textContent = (t as HTMLTextAreaElement).value || "";
      t.replaceWith(div);
    });

    let finalHtml = iframeDoc.body.innerHTML;
    finalHtml = finalHtml.replace(/{{companyName}}/g, "Avantika Solutions");
    finalHtml = finalHtml.replace(/{{address}}/g, "Mumbai, India");
    finalHtml = finalHtml.replace(/{{email}}/g, "info@avantika.com");
    finalHtml = finalHtml.replace(/{{phone}}/g, "+91-9876543210");
    finalHtml = finalHtml.replace(/{{year}}/g, "2025");

    await exportToPdf(finalHtml, css);
  };

  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw" }}>
      {/* Sidebar */}
      <div id="blocks" style={{ width: "205px", background: "#f7f7f7", padding: 10, overflowY: "auto" }} />

      {/* Editor */}
      <GrapesEditor onInit={setEditor} />

      {/* Toolbar with save + preview */}
      <Toolbar onSave={handleSave} onPreview={handlePreview} initialName={templateName} />
    </div>
  );
}
