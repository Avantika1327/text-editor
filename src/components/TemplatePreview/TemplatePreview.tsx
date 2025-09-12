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
        <h2 className="text-xl font-semibold">Template not found</h2>
        <button
          className="mt-4 px-4 py-2 bg-blue-600 text-dark rounded-lg hover:bg-blue-700"
          onClick={() => navigate("/")}
        >
          ⬅ Back to List
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
           Preview: {template.name}
        </h2>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800"
        >
          ⬅ Back
        </button>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        {/* Template Render */}
        <style>{template.css}</style>
        <div dangerouslySetInnerHTML={{ __html: template.html }} />
      </div>
    </div>
  );
}
