import { Routes, Route } from "react-router-dom";
import TemplateList from "./components/TemplateList/TemplateList";
import TemplateBuilder from "./components/TemplateBuilder/TemplateBuilder";
import TemplatePreview from "./components/TemplatePreview/TemplatePreview";
import DocumentCreation from "./components/Document/DocumentCreation";
import DocumentEditor from "./components/Document/DocumentEditor";
import DocumentList from "./components/Document/DocumentList";
import DocumentPreview from "./components/Document/DocumentPreview";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<TemplateList />} />
      <Route path="/builder" element={<TemplateBuilder />} />
      <Route path="/builder/:id" element={<TemplateBuilder />} />
      <Route path="/preview/:id" element={<TemplatePreview />} />
      <Route path="/document" element={<DocumentCreation />} />
      <Route path="/document-editor" element={<DocumentEditor />} />
      <Route path="/document-list" element={<DocumentList />} />
      <Route path="/docpreview/:id" element={<DocumentPreview />} />

    </Routes>
  );
}



