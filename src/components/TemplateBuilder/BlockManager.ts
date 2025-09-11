export function addCustomBlocks(editor: any) {
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
}

export function addDynamicFields(editor: any) {
  const fields = [
    { id: "username", label: "Username" },
    { id: "date", label: "Date" },
    { id: "invoiceNumber", label: "Invoice No" },
  ];

  fields.forEach((field) => {
    editor.BlockManager.add(`field-${field.id}`, {
      label: field.label,
      category: "Dynamic Fields",
      content: `<span data-dynamic="${field.id}">{{${field.id}}}</span>`,
    });
  });
}
