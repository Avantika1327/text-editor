import { useParams, useNavigate } from "react-router-dom";
import { getTemplate } from "../../utils/templateStorage";

export default function TemplatePreview() {
  const { id } = useParams();
  const navigate = useNavigate();

  if (!id) return <div className="p-6 text-red-500"> Invalid template ID</div>;

  const template = getTemplate(id);

  if (!template) {
    return (
      <div className="p-6 text-center text-gray-500">
        <h2 className="text-xl font-semibold">Template</h2>
        <button
          className="mt-4 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => navigate("/")}
        >
          ⬅ Back to List
        </button>
      </div>
    );
  }

  // Preview layout
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 border-b pb-3">
        <h2 className="text-2xl font-bold text-gray-900">
          Preview: <span className="text-blue-600">{template.name}</span>
        </h2>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 text-sm font-medium bg-gray-700 text-white rounded hover:bg-gray-800"
        >
          ⬅ Back
        </button>
      </div>

      {/* A4 Preview Body */}
      <div className="flex justify-center">
        <div
          className="bg-white shadow-lg rounded-lg p-6"
          style={{
            width: "210mm", // A4 width
            minHeight: "auto", // A4 height
            margin: "auto",
            boxSizing: "border-box",
            padding: "5mm",
          }}
        >
          {/* Inject custom template CSS */}
          <style>{template.css}</style>

          {/* Add global preview styles */}
          <style>
            {`
              .preview-body img {
                max-width: 20%;
                height: auto;
                display: block;
              }

              .preview-body table {
                width: 100%;
                margin-top: 1rem;
              }

              .preview-body th,
              .preview-body td {
                border: 1px solid #000;
                padding: 8px;
                text-align: center;
                vertical-align: middle;
              }

              .preview-body th {
                font-weight: bold;
                background-color: #f5f5f5;
              }
            `}
          </style>

          {/* Render only dynamic Template HTML */}
          <div
            className="preview-body"
            dangerouslySetInnerHTML={{ __html: template.html }}
          />
        </div>
      </div>
    </div>
  );
}
