import { useEffect, useRef } from "react";
import grapesjs from "grapesjs";
import "grapesjs/dist/css/grapes.min.css";
import { addCustomBlocks, addDynamicFields } from "./BlockManager";

interface GrapesEditorProps {
  onInit: (editor: any) => void;
}

export default function GrapesEditor({ onInit }: GrapesEditorProps) {
  const editorRef = useRef<any>(null);

  useEffect(() => {
    if (!editorRef.current) {
      const editor = grapesjs.init({
        container: "#gjs",
        height: "100%",   // parent full height
        width: "100%",    // parent full width
        storageManager: false,
        plugins: ["gjs-blocks-basic"],
        blockManager: { appendTo: "#blocks" },
        canvas: { styles: [], scripts: [] },
        deviceManager: {
          devices: [{ name: "A4", width: "210mm", height: "297mm" }],
        },
      });

      // Custom blocks & fields
      addCustomBlocks(editor);
      addDynamicFields(editor);

      // Scroll fix
      const style = document.createElement("style");
      style.innerHTML = `
        .gjs-cv-canvas {
          height: 100% !important;
          overflow: auto !important;
          background: #f9f9f9;

        }
        .gjs-editor {
          height: 100% !important;
        }
        body, html, #gjs {
          height: 100%;
        }
      `;
      document.head.appendChild(style);

      editorRef.current = editor;
      onInit(editor);
    }
  }, [onInit]);

   return (
    <div style={{ width: "73%", height: "100vh", border: "1px solid #ddd" }}>
      <div id="gjs" style={{ height: "100%" }} />
    </div>
  );
}
