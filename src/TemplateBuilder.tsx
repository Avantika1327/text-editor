import { useEffect, useRef } from "react";
import grapesjs from "grapesjs";
import "grapesjs/dist/css/grapes.min.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface TemplateBuilderProps {
  onSave: (data: { html: string; css: string; json: any }) => void;
}

export default function TemplateBuilder() {
  const editorRef = useRef<any>(null);

  useEffect(() => {
    if (!editorRef.current) {
      const editor = grapesjs.init({
        container: "#gjs",
        height: "100vh",
        width: "70%",
        storageManager: false,
        plugins: ["gjs-blocks-basic"],
        pluginsOpts: { "gjs-blocks-basic": {} },
        blockManager: {
          appendTo: "#blocks",
        },
         canvas: {
    styles: [],
    scripts: [],
  },
  deviceManager: {
    devices: [
      {
        name: "A4",
        width: "794px",
        height: "1123px",
      },
    ],
  },
      });

      // ---------- Custom Blocks ----------
      const customBlocks = [
        {
          id: "custom-header",
          label: "Header",
          category: "Custom",
          content: `<header style="display:flex;justify-content:space-between;align-items:center;padding:20px;border-bottom:1px solid #ddd;">
                      <img src="https://via.placeholder.com/100" style="height:50px"/>
                      <div>
                        <h2>{{companyName}}</h2>
                        <div>
                        <p>{{address}} </p> <p> {{email}} </p> <p> {{phone}}</p>
                        </div>
                      </div>
                    </header>`,
        },
        {
          id: "custom-footer",
          label: "Footer",
          category: "Custom",
          content: `<footer style="text-align:center;padding:20px;border-top:1px solid #ddd;">
                      © {{year}} {{companyName}} Pvt Ltd. All rights reserved.
                    </footer>`,
        },
        {
          id: "custom-table",
          label: "Table",
          category: "Custom",
          content: `<table style="width:100%;border-collapse:collapse;text-align:center;">
                      <tr>
                        <td style="border:1px solid #000;padding:8px;"><span>Col 1</span></td>
                        <td style="border:1px solid #000;padding:8px;"><span>Col 2</span></td>
                        <td style="border:1px solid #000;padding:8px;"><span>Col 3</span></td>
                        <td style="border:1px solid #000;padding:8px;"><span>Col 4</span></td>
                      </tr>
                      <tr>
                        <td style="border:1px solid #000;padding:8px;" colspan="2"><span>Merged</span></td>
                        <td style="border:1px solid #000;padding:8px;" colspan="2"><span>Merged</span></td>
                      </tr>
                    </table>`,
        },
        {
          id: "text-block",
          label: "Text",
          category: "Basic",
          content: `<div contenteditable="true">Editable text here</div>`,
        },
        {
          id: "image-block",
          label: "Image",
          category: "Basic",
          content: `<img src="https://via.placeholder.com/200" alt="image" />`,
        },
        {
          id: "button-block",
          label: "Button",
          category: "Basic",
          content: `<button style="padding:10px 20px;background:#2563eb;color:white;border:none;border-radius:6px;">Click Me</button>`,
        },
        {
          id: "row-col",
          label: "Row/Column",
          category: "Layout",
          content: `<div style="display:flex;gap:10px;">
                      <div style="flex:1;border:1px dashed #ccc;padding:10px;">Column 1</div>
                      <div style="flex:1;border:1px dashed #ccc;padding:10px;">Column 2</div>
                    </div>`,
        },
      ];

      customBlocks.forEach((block) => editor.BlockManager.add(block.id, block));

      // ---------- Dynamic Fields ----------
      const dynamicFields = [
        { id: "username", label: "Username" },
        { id: "date", label: "Date" },
        { id: "invoiceNumber", label: "Invoice No" },
      ];

      dynamicFields.forEach((field) => {
        editor.BlockManager.add(`field-${field.id}`, {
          label: field.label,
          category: "Dynamic Fields",
          content: `<span data-dynamic="${field.id}">{{${field.id}}}</span>`,
        });
      });

      editorRef.current = editor;
    }
  }, []);

  // ---------- Save Template ----------
  const handleSave = () => {
    if (!editorRef.current) return;
    const html = editorRef.current.getHtml();
    const css = editorRef.current.getCss();
    const json = editorRef.current.getComponents();

    // onSave({ html, css, json });
    alert("✅ Template Saved (check DB logic)");
  };

  // ---------- Preview & Export PDF ----------
  // const handlePreview = () => {
  //   if (!editorRef.current) return;
  //   let html = editorRef.current.getHtml();
  //   const css = editorRef.current.getCss();

  //   const data: any = {
  //     companyName: "Avantika Solutions",
  //     address: "Mumbai, India",
  //     email: "info@avantika.com",
  //     phone: "+91-9876543210",
  //     year: "2025",
  //     username: "Avantika",
  //     date: "10-09-2025",
  //     invoiceNumber: "INV-12345",
  //   };

  //   Object.keys(data).forEach((key) => {
  //     html = html.replace(new RegExp(`{{${key}}}`, "g"), data[key]);
  //   });

  //   const container = document.createElement("div");
  //   container.innerHTML = `<style>${css}</style>${html}`;
  //   document.body.appendChild(container);

  //   html2canvas(container).then((canvas) => {
  //     const imgData = canvas.toDataURL("image/png");
  //     const pdf = new jsPDF("p", "pt", "a4");
  //     const pageWidth = pdf.internal.pageSize.getWidth();
  //     const imgWidth = pageWidth - 40;
  //     const imgHeight = (canvas.height * imgWidth) / canvas.width;

  //     pdf.addImage(imgData, "PNG", 20, 20, imgWidth, imgHeight);
  //     pdf.save("template.pdf");
  //     document.body.removeChild(container);
  //   });
  // };

  const handlePreview = async () => {
  if (!editorRef.current) return;

  let html = editorRef.current.getHtml();
  const css = editorRef.current.getCss();

  // Dynamic data replacement
  const data: Record<string, string> = {
    companyName: "Avantika Solutions",
    address: "Mumbai, India",
    email: "info@avantika.com",
    phone: "+91-9876543210",
    year: "2025",
    username: "Avantika",
    date: "10-09-2025",
    invoiceNumber: "INV-12345",
  };

  Object.keys(data).forEach((key) => {
    html = html.replace(new RegExp(`{{${key}}}`, "g"), data[key]);
  });

  // Create temporary container
  const container = document.createElement("div");
  container.style.width = "794px"; // A4 width in px
  container.style.minHeight = "1123px"; // A4 height in px
  container.style.background = "white";
  container.innerHTML = `<style>${css}</style>${html}`;
  document.body.appendChild(container);

  // Convert HTML to canvas
  const canvas = await html2canvas(container, { scale: 2 });
  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "pt", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // Scale image proportionally to fit A4
  const imgWidth = pageWidth;
  const imgHeight = (canvas.height * pageWidth) / canvas.width;

  // Handle multi-page PDF
  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  pdf.save("template.pdf");
  document.body.removeChild(container);
};


  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw" }}>
      {/* LEFT: Blocks */}
      <div
        id="blocks"
        style={{
          width: "250px",
          background: "#f7f7f7",
          padding: "10px",
          overflowY: "auto",
        }}
      ></div>

      {/* RIGHT: Editor */}
      <div id="gjs" style={{ border: "1px solid #ddd" }}></div>

      {/* Buttons */}
      <div
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          display: "flex",
          gap: "10px",
        }}
      >
        <button
          onClick={handleSave}
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
          onClick={handlePreview}
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
    </div>
  );
}
