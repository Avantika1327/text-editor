import { useState } from "react";
import GrapesEditor from "./GrapesEditor";
import Toolbar from "./Toolbar";
import { exportToPdf } from "./PdfUtils";

export default function TemplateBuilder() {
  const [editor, setEditor] = useState<any>(null);

  const handleSave = () => {
    if (!editor) return;
    const html = editor.getHtml();
    const css = editor.getCss({ withMedia: true });
    const json = editor.getComponents();

    console.log(css);

    console.log("Template saved", { html, css, json });
    alert("✅ Template Saved (implement DB save here)");
  };

  const handlePreview = () => {
    if (!editor) return;
    const html = editor.getHtml();
    const css = editor.getCss({ withMedia: true });
    console.log(css);
    exportToPdf(html, css, {
      companyName: "Avantika Solutions",
      address: "Mumbai, India",
      email: "info@avantika.com",
      phone: "+91-9876543210",
      year: "2025",
      username: "Avantika",
      date: "10-09-2025",
      invoiceNumber: "INV-12345",
      signatoryBy: "John Doe",
      signatoryOn: "15-09-2025",
      category: "Software",
      subcategory: "Development",
      userdetails: "Jane Smith",
      department: "Engineering",

      "Prepared By":"qwert",
      "Approve By":"asdfg",
      "Verified By" :"zxcvb",
      "Done By" :"hjkl;",
      "Validated By": "poiuy",
      "Issued By" : "nmnnmnj",



      "Prepared On":"qwert",
      "Approve On":"asdfg",
      "Verified On" :"zxcvb",
      "Done On" :"hjkl;",
      "Validated On": "poiuy",
      "Issued On" : "nmnnmnj",
      "Effective On" : "lkmjnhbgv"
  
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
