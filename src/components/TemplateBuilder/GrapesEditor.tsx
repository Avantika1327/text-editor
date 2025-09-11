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
        height: "100vh",
        width: "70%",
        storageManager: false,
        plugins: ["gjs-blocks-basic"],
        blockManager: { appendTo: "#blocks" },
        deviceManager: {
          devices: [{ name: "A4", width: "800px", height: "1200px" }],
        },
      });

      addCustomBlocks(editor);
      addDynamicFields(editor);

      editorRef.current = editor;
      onInit(editor);
    }
  }, [onInit]);

  return <div id="gjs" style={{ border: "1px solid #ddd" }} />;
}
