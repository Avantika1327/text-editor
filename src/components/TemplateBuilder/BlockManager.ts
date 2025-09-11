export function addCustomBlocks(editor: any) {
  const customBlocks = [
    {
      id: "custom-header",
      label: "Header",
      category: "Custom",
      content: {
        type: "default",
        components: [
          {
            tagName: "header",
            attributes: {
              style:
                "display:flex;justify-content:space-between;align-items:center;padding:20px;border-bottom:1px solid #ddd;",
            },
            components: [
              {
                tagName: "img",
                attributes: {
                  src: "https://via.placeholder.com/100",
                  style: "height:50px",
                },
              },
              {
                tagName: "div",
                components: [
                  {
                    tagName: "h2",
                    content: "{{companyName}}",
                  },
                  {
                    tagName: "div",
                    components: [
                      { tagName: "p", content: "{{address}}" },
                      { tagName: "p", content: "{{email}}" },
                      { tagName: "p", content: "{{phone}}" },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    },
    {
      id: "custom-footer",
      label: "Footer",
      category: "Custom",
      content: {
        type: "default",
        components: [
          {
            tagName: "footer",
            attributes: {
              style:
                "text-align:center;padding:20px;border-top:1px solid #ddd;",
            },
            content:
              "© {{year}} {{companyName}} Pvt Ltd. All rights reserved.",
          },
        ],
      },
    },
    {
      id: "custom-table",
      label: "Table",
      category: "Custom",
      content: {
        type: "default",
        components: [
          {
            tagName: "table",
            attributes: {
              style:
                "width:100%;border-collapse:collapse;text-align:center;",
            },
            components: [
              {
                tagName: "tr",
                components: [
                  {
                    tagName: "td",
                    attributes: {
                      style: "border:1px solid #000;padding:8px;",
                    },
                    content: "Col 1",
                  },
                  {
                    tagName: "td",
                    attributes: {
                      style: "border:1px solid #000;padding:8px;",
                    },
                    content: "Col 2",
                  },
                  {
                    tagName: "td",
                    attributes: {
                      style: "border:1px solid #000;padding:8px;",
                    },
                    content: "Col 3",
                  },
                  {
                    tagName: "td",
                    attributes: {
                      style: "border:1px solid #000;padding:8px;",
                    },
                    content: "Col 4",
                  },
                ],
              },
              {
                tagName: "tr",
                components: [
                  {
                    tagName: "td",
                    attributes: {
                      colspan: "2",
                      style: "border:1px solid #000;padding:8px;",
                    },
                    content: "Merged",
                  },
                  {
                    tagName: "td",
                    attributes: {
                      colspan: "2",
                      style: "border:1px solid #000;padding:8px;",
                    },
                    content: "Merged",
                  },
                ],
              },
            ],
          },
        ],
      },
    },
    {
      id: "text-block",
      label: "Text",
      category: "Basic",
      content: {
        type: "text",
        content: "Editable text here",
      },
    },
    {
      id: "image-block",
      label: "Image",
      category: "Basic",
      content: {
        type: "image",
        attributes: {
          src: "https://via.placeholder.com/200",
          alt: "image",
        },
      },
    },
    {
      id: "button-block",
      label: "Button",
      category: "Basic",
      content: {
        type: "default",
        components: [
          {
            tagName: "button",
            attributes: {
              style:
                "padding:10px 20px;background:#2563eb;color:white;border:none;border-radius:6px;",
            },
            content: "Click Me",
          },
        ],
      },
    },
    {
      id: "row-col",
      label: "Row/Column",
      category: "Layout",
      content: {
        type: "default",
        components: [
          {
            tagName: "div",
            attributes: {
              style: "display:flex;gap:10px;",
            },
            components: [
              {
                tagName: "div",
                attributes: {
                  style:
                    "flex:1;border:1px dashed #ccc;padding:10px;min-height:50px;",
                },
                content: "Column 1",
              },
              {
                tagName: "div",
                attributes: {
                  style:
                    "flex:1;border:1px dashed #ccc;padding:10px;min-height:50px;",
                },
                content: "Column 2",
              },
            ],
          },
        ],
      },
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
