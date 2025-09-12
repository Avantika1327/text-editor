import { Routes, Route } from "react-router-dom";
import TemplateList from "./components/TemplateList/TemplateList";
import TemplateBuilder from "./components/TemplateBuilder/TemplateBuilder";
import TemplatePreview from "./components/TemplatePreview/TemplatePreview";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<TemplateList />} />
      <Route path="/builder" element={<TemplateBuilder />} />
      <Route path="/builder/:id" element={<TemplateBuilder />} />
      <Route path="/preview/:id" element={<TemplatePreview />} /> {/* 👈 View route */}
    </Routes>
  );
}
