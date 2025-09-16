import { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import GrapesEditor from "./GrapesEditor";
import Toolbar from "./Toolbar";
import { exportToPdf } from "./PdfUtils";
import { saveTemplate, getTemplate, generateId } from "../../utils/templateStorage";
import type { TemplateItem } from "../../utils/templateStorage"; // ✅ type-only import


export default function TemplateBuilder() {
  const [editor, setEditor] = useState<any>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const [type, setType] = useState<"header" | "footer" | "generic" | undefined>(undefined);

  useEffect(() => {
    // Auto insert based on button click
    if (location.state?.auto) {
      setType(location.state.auto as "header" | "footer" | "generic");
    }

    // Load existing template
    if (id && editor) {
      const template = getTemplate(id);
      if (template) {
        editor.setComponents(template.html);
        editor.setStyle(template.css);
        setType(template.type || "generic");
      }
    }
  }, [id, editor, location.state]);


useEffect(() => {
  if (editor) {
    const meta = JSON.parse(localStorage.getItem("document_meta") || "{}");

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

  
    if (meta?.header) {
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

 
    if (meta?.footer) {
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
  }
}, [editor]);


 
  const handleSave = () => {
    if (!editor) return;

    const html = editor.getHtml();
    const css = editor.getCss({ withMedia: true });
    const json = editor.getComponents();
    const now = new Date().toISOString();

    const template: TemplateItem = {
      id: id || generateId(),
      name: `Template ${id || Date.now()}`,
      type: type || "generic",
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

    // Replace inputs, selects, textareas with spans/divs for preview
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

    iframeDoc.querySelectorAll("img").forEach(img => {
      const style = window.getComputedStyle(img);
      (img as HTMLImageElement).style.width = style.width;
      (img as HTMLImageElement).style.height = style.height;
      (img as HTMLImageElement).style.objectFit = "contain";
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
      <GrapesEditor onInit={setEditor}  />
      <Toolbar onSave={handleSave} onPreview={handlePreview} />
    </div>
  );
}
