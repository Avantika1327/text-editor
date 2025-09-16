import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export async function exportToPdf(html: string, css: string) {
  const pdf = new jsPDF("p", "mm", "a4");

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const dpi = 96;
  const mmToPx = (mm: number) => (mm * dpi) / 25.4;
  const pageWidthPx = mmToPx(pdfWidth);

  const container = document.createElement("div");
  container.style.position = "absolute";
  container.style.top = "0";
  container.style.left = "50%";
  container.style.transform = "translateX(-50%)";
  container.style.width = pageWidthPx + "px"; // exactly page width
  container.style.backgroundColor = "white";

  container.innerHTML = `
    <html>
      <head>
        <style>
          body { 
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center; /* full HTML center */
          }
          ${css}
        </style>
      </head>
      <body>${html}</body>
    </html>
  `;

  document.body.appendChild(container);

  const canvas = await html2canvas(container, { 
    scale: 2, 
    useCORS: true,
    backgroundColor: "#ffffff"
  });

  document.body.removeChild(container);

  const imgData = canvas.toDataURL("image/png");
  const imgProps = pdf.getImageProperties(imgData);

  const imgWidth = pdfWidth;
  const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

  // X offset काढून image perfect center मध्ये add करा
  const xOffset = (pdf.internal.pageSize.getWidth() - imgWidth) / 2;

  pdf.addImage(imgData, "PNG", xOffset, 0, imgWidth, imgHeight);
  pdf.save("template.pdf");
}
