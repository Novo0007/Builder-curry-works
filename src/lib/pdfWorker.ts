import { pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Use react-pdf's built-in worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "react-pdf/dist/esm/pdf.worker.entry.js",
  import.meta.url,
).toString();

export { pdfjs };
