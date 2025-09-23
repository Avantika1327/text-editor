import { useParams, useNavigate } from "react-router-dom";
import { getDocument } from "../../utils/documentStorage";

export default function DocumentPreview() {
  const { id } = useParams();
  const navigate = useNavigate();

  if (!id) return <div className="p-6 text-red-500"> Invalid Document ID</div>;

  const Document = getDocument(id);

  if (!Document) {
    return (
      <div className="p-6 text-center text-gray-500">
        <h2 className="text-xl font-semibold">Document</h2>
        <button
          className="mt-4 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => navigate("/document")}
        >
          ⬅ Back to List
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <div className="flex items-center justify-between mb-6 border-b pb-3">
      
        <button
          onClick={() => navigate("/document")}
          className="px-4 py-2 text-sm font-medium bg-gray-700 text-white rounded hover:bg-gray-800"
        >
          ⬅ Back
        </button>
      </div>

      <div className="flex justify-center">
        <div
          className="bg-white shadow-lg rounded-lg p-6"
          style={{
            width: "210mm",
            minHeight: "auto",
            margin: "auto",
            boxSizing: "border-box",
            padding: "5mm",
          }}
        >

          <style>{Document.css}</style>


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


          <div
            className="preview-body"
            dangerouslySetInnerHTML={{ __html: Document.html }}
          />
        </div>
      </div>
    </div>
  );
}
