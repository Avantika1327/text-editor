import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import TemplateBuilder from './components/TemplateBuilder/TemplateBuilder.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TemplateBuilder />
  </StrictMode>,
)
