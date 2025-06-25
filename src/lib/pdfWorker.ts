import { pdfjs } from "react-pdf";

// Configure PDF.js worker - use CDN approach for better compatibility
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

export { pdfjs };
