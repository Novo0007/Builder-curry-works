import { pdfjs } from "react-pdf";

// Configure PDF.js worker - use Vite-compatible approach
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

export { pdfjs };
