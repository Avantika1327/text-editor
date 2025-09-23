import { Routes, Route } from "react-router-dom";
import TemplateList from "./components/TemplateList/TemplateList";
import TemplateBuilder from "./components/TemplateBuilder/TemplateBuilder";
import TemplatePreview from "./components/TemplatePreview/TemplatePreview";
import DocumentCreation from "./components/Document/DocumentCreation";
import DocumentEditor from "./components/Document/DocumentEditor";
import DocumentList from "./components/Document/DocumentList";
import DocumentPreview from "./components/Document/DocumentPreview";
import AccordionComponent from "./components/AccordionComponent/AccordionComponent";
import CategoryList from "./components/categories/CategoryList";
import CategoryForm from "./components/categories/CategoryForm";
import FieldsList from "./components/fields/FieldsList";
import LabForm from "./components/CreateLab/LabForm";
import ResourceForm from "./components/resources/ResourceForm";


import 'bootstrap/dist/css/bootstrap.min.css';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<TemplateList />} />
      <Route path="/builder" element={<TemplateBuilder />} />
      <Route path="/builder/:id" element={<TemplateBuilder />} />
      <Route path="/preview/:id" element={<TemplatePreview />} />
      <Route path="/document" element={<DocumentCreation />} />
      <Route path="/document-editor" element={<DocumentEditor />} />
      <Route path="/document-editor/:id" element={<DocumentEditor />} />
      <Route path="/document-list" element={<DocumentList />} />
      <Route path="/docpreview/:id" element={<DocumentPreview />} />
      <Route path="/accordion" element={<AccordionComponent />} />
      <Route path="/categories" element={<CategoryList />} />
      <Route path="/add-category" element={<CategoryForm onSave={() => {}} onCancel={() => {}} />} />
      <Route path="/edit-category/:id" element={<CategoryForm onSave={() => {}} onCancel={() => {}} />} />
      <Route path="/fields" element={<FieldsList/>} />
      <Route path="/labs" element={<LabForm/>} />
      <Route path="/resources" element={<ResourceForm/>} />
    </Routes>
  );
}
