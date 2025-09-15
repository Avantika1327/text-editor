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
            classes: ['custom-header'],
            stylable: true,
            components: [
              {
                type: "image",
                attributes: {
                  src: "https://via.placeholder.com/100",
                },
                classes: ['header-logo'],
                stylable: ['height', 'width'],
              },
              {
                tagName: "div",
                components: [
                  {
                    type: "text",
                    content: "{{companyName}}",
                    classes: ['company-name'],
                    stylable: true,
                  },
                  {
                    tagName: "div",
                    components: [
                      {
                        type: "text",
                        content: "{{address}}",
                        classes: ['company-address'],
                        stylable: true,
                      },
                      {
                        type: "text",
                        content: "{{email}}",
                        classes: ['company-email'],
                        stylable: true,
                      },
                      {
                        type: "text",
                        content: "{{phone}}",
                        classes: ['company-phone'],
                        stylable: true,
                      },
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
            classes: ['custom-footer'],
            stylable: true,
            components: [
              {
                type: "text",
                content: "© {{year}} {{companyName}} Pvt Ltd. All rights reserved.",
                stylable: true,
              },
            ],
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
            classes: ['custom-table'],
            stylable: true,
            components: [
              {
                tagName: "tr",
                components: [
                  ...["Col 1", "Col 2", "Col 3", "Col 4"].map((col) => ({
                    tagName: "td",
                    content: col,
                    classes: ['table-cell'],
                    stylable: true,
                  })),
                ],
              },
              {
                tagName: "tr",
                components: [
                  {
                    tagName: "td",
                    attributes: { colspan: "2" },
                    content: "Merged",
                    classes: ['table-cell'],
                    stylable: true,
                  },
                  {
                    tagName: "td",
                    attributes: { colspan: "2" },
                    content: "Merged",
                    classes: ['table-cell'],
                    stylable: true,
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
        stylable: true,
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
        stylable: ['width', 'height', 'border-radius', 'box-shadow'],
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
            content: "Click Me",
            classes: ['custom-button'],
            stylable: true,
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
            classes: ['row'],
            stylable: true,
            components: [
              {
                tagName: "div",
                classes: ['col'],
                content: "Column 1",
                stylable: true,
              },
              {
                tagName: "div",
                classes: ['col'],
                content: "Column 2",
                stylable: true,
              },
            ],
          },
        ],
      },
    },
    {
      id: "div-block",
      label: "Div Block",
      category: "Layout",
      content: {
        type: "default",
        components: [
          {
            tagName: "div",
            classes: ['custom-div'],
            stylable: true,
            components: [
              {
                type: "text",
                content: "Editable content inside div",
                stylable: true,
              },
            ],
          },
        ],
      },
    },
  ];

  customBlocks.forEach((block) => editor.BlockManager.add(block.id, block));

  // Add default styles to make the classes work visually
  editor.CssComposer.addRules([
    {
      selectors: ['.custom-header'],
      style: {
        display: 'flex',
        'justify-content': 'space-between',
        'align-items': 'center',
        padding: '20px',
        'border-bottom': '1px solid #ddd',
      },
    },
    {
      selectors: ['.custom-footer'],
      style: {
        'text-align': 'center',
        padding: '20px',
        'border-top': '1px solid #ddd',
      },
    },
    {
      selectors: ['.custom-table'],
      style: {
        width: '100%',
        'border-collapse': 'collapse',
        'text-align': 'center',
      },
    },
    {
      selectors: ['.table-cell'],
      style: {
        border: '1px solid #000',
        padding: '8px',
      },
    },
    {
      selectors: ['.custom-button'],
      style: {
        padding: '10px 20px',
        background: '#2563eb',
        color: 'white',
        border: 'none',
        'border-radius': '6px',
        cursor: 'pointer',
      },
    },
    {
      selectors: ['.row'],
      style: {
        display: 'flex',
        gap: '10px',
      },
    },
    {
      selectors: ['.col'],
      style: {
        flex: '1',
        border: '1px dashed #ccc',
        padding: '10px',
        'min-height': '50px',
      },
    },
    {
      selectors: ['.custom-div'],
      style: {
        padding: '15px',
        border: '1px solid #ccc',
        'border-radius': '6px',
        'min-height': '50px',
      },
    },
  ]);
}


export function addDynamicFields(editor: any) {
  const dynamicJSON = {
    signatoryBy: [
      "Prepared By",
      "Approve By",
      "Verified By",
      "Done By",
      "Validated By",
      "Issued By",
    ],
    signatoryOn: [
      "Prepared On",
      "Approve On",
      "Verified On",
      "Done On",
      "Validated On",
      "Issued On",
      "Effective On",
    ],
  };

  // Static fields
  const fields = [
    { id: "username", label: "Username" },
    { id: "date", label: "Date" },
    { id: "invoiceNumber", label: "Invoice No" },
    { id: "category", label: "Category" },
    { id: "subcategory", label: "Sub Category" },
    { id: "userdetails", label: "User Details" },
    { id: "department", label: "Department" },
  ];

  fields.forEach((field) => {
    editor.BlockManager.add(`field-${field.id}`, {
      label: field.label,
      category: "Dynamic Fields",
      content: `<span data-dynamic="${field.id}">{{${field.id}}}</span>`,
    });
  });

  // Signatory By block
  editor.BlockManager.add("signatory-by", {
    label: "Signatory By",
    category: "Dynamic Fields",
    content: `
      <div class="signatory-by-container">
        ${dynamicJSON.signatoryBy
          .map(
            (item) =>
              `<div class="signatory-item"><strong>${item}:</strong> <span data-dynamic="${item}">{{${item}}}</span></div>`
          )
          .join("")}
      </div>
    `,
  });

  // Signatory On block
  editor.BlockManager.add("signatory-on", {
    label: "Signatory On",
    category: "Dynamic Fields",
    content: `
      <div class="signatory-on-container">
        ${dynamicJSON.signatoryOn
          .map(
            (item) =>
              `<div class="signatory-item"><strong>${item}:</strong> <span data-dynamic="${item}">{{${item}}}</span></div>`
          )
          .join("")}
      </div>
    `,
  });


}
