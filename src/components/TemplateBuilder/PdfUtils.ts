import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export async function exportToPdf(html: string, css: string, data: Record<string, string>) {
  // Replace placeholders with dynamic values
  Object.keys(data).forEach((key) => {
    html = html.replace(new RegExp(`{{${key}}}`, "g"), data[key]);
  });

  // Create container for rendering
  const container = document.createElement("div");
  container.style.width = "794px"; // A4 width
  container.style.minHeight = "1123px"; // A4 height
  container.style.background = "white";
  container.innerHTML = `<style>${css}</style>${html}`;
  document.body.appendChild(container);

  // Convert to canvas
  const canvas = await html2canvas(container, { scale: 2 });
  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "pt", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const imgWidth = pageWidth;
  const imgHeight = (canvas.height * pageWidth) / canvas.width;

  // Add pages if needed
  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  pdf.save("template.pdf");
  document.body.removeChild(container);
}
