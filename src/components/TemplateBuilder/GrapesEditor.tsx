import { useEffect, useRef } from "react";
import grapesjs from "grapesjs";
import "grapesjs/dist/css/grapes.min.css";
import { addCustomBlocks, addDynamicFields } from "./BlockManager";
import { useLocation } from "react-router-dom";
import ReactDOMServer from "react-dom/server";
import HeaderBlock from "./HeaderBlock";
import FooterBlock from "./FooterBlock";

interface GrapesEditorProps {
  onInit: (editor: any) => void;
   docData?: any;  
}

export default function GrapesEditor({ onInit, docData }: GrapesEditorProps) {
  const editorRef = useRef<any>(null);
  const location = useLocation();

  useEffect(() => {
    if (!editorRef.current) {
      const editor = grapesjs.init({
        container: "#gjs",
        height: "100%",
        width: "100%",
        storageManager: false,
        plugins: ["gjs-blocks-basic"],
        blockManager: { appendTo: "#blocks" },
        canvas: { styles: [], scripts: [] },
        deviceManager: {
          devices: [{ name: "A4", width: "210mm", height: "297mm" }],
        },
      });


      addCustomBlocks(editor);
      addDynamicFields(editor, docData);


      editor.Commands.add("insert-header", {
        run(ed) {
          const html = ReactDOMServer.renderToStaticMarkup(<HeaderBlock />);
          ed.addComponents(html);
        },
        
      });

      editor.Commands.add("insert-footer", {
        run(ed) {
          const html = ReactDOMServer.renderToStaticMarkup(<FooterBlock />);
          ed.addComponents(html);
        },
      });


      editor.on("load", () => {
        if (location.state?.auto === "header") editor.runCommand("insert-header");
        if (location.state?.auto === "footer") editor.runCommand("insert-footer");
        if (location.state?.auto === "header-footer") {
          editor.runCommand("insert-header");
          editor.runCommand("insert-footer");
        }
      });

      editorRef.current = editor;
      onInit(editor);

      return () => {
        editor.destroy();
        editorRef.current = null;
      };
    }
  }, [onInit, location.state]);

  return (
    <div style={{ width: "73%", height: "100vh", border: "1px solid #ddd" }}>
      <div id="gjs" style={{ height: "100%" }} />
      <div id="blocks" />
    </div>
  );
}
