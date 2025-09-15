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
  const { id } = useParams();

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
      id: id || generateId(),
      name: `Template ${id || Date.now()}`,
      html,
      css,
      json,
      createdAt: now,
      updatedAt: now,
      archived: false,
    };

    saveTemplate(template);
    alert("✅ Template Saved!");
    navigate("/");
  };

const handlePreview = async () => {
  if (!editor) return;

  const css = editor.getCss({ withMedia: true });

  const iframe = document.querySelector<HTMLIFrameElement>(".gjs-frame");
  if (!iframe) return;
  const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
  if (!iframeDoc) return;

  
  iframeDoc.querySelectorAll<HTMLSelectElement>("select").forEach((selectEl) => {
    const value = selectEl.value || "";
    const span = document.createElement("span");
    span.style.fontWeight = "bold";
    span.textContent = value || "(Not Selected)";
    selectEl.replaceWith(span);
  });

  
  iframeDoc.querySelectorAll<HTMLInputElement>("input").forEach((inputEl) => {
    const value = inputEl.value || inputEl.placeholder || "";
    const span = document.createElement("span");
    span.style.fontWeight = "bold";
    span.textContent = value;
    inputEl.replaceWith(span);                                                                                                                                                                                                                                                                                                                                                                                              
  });

  
  iframeDoc.querySelectorAll<HTMLTextAreaElement>("textarea").forEach((txtEl) => {
    const value = txtEl.value || "";
    const div = document.createElement("div");
    div.style.fontWeight = "bold";
    div.textContent = value;
    txtEl.replaceWith(div);
  });

  
  iframeDoc.querySelectorAll<HTMLImageElement>("img").forEach((imgEl) => {
    const style = window.getComputedStyle(imgEl);
    const width = style.width;
    const height = style.height;

  
    imgEl.setAttribute(
      "style",
      `width:${width}; height:${height}; object-fit: contain;`
    );
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
