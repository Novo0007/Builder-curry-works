import React from "react";
import { PDFViewer } from "@/components/pdf/PDFViewer";
import { useTheme } from "next-themes";

const PDFViewerPage: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className="h-screen w-full">
      <PDFViewer
        enableAnnotations={true}
        enableSearch={true}
        enableThumbnails={true}
        enableOutline={true}
        enablePrint={true}
        enableDownload={true}
        onDocumentLoad={(document) => {
          console.log("Document loaded:", document);
          // Store document metadata for future features
        }}
        onPageChange={(pageNumber) => {
          console.log("Page changed to:", pageNumber);
          // Update URL or analytics
        }}
        onZoomChange={(scale) => {
          console.log("Zoom changed to:", scale);
          // Store user preferences
        }}
        onAnnotationAdd={(annotation) => {
          console.log("Annotation added:", annotation);
          // Sync with backend/storage
        }}
        onAnnotationUpdate={(annotation) => {
          console.log("Annotation updated:", annotation);
          // Sync with backend/storage
        }}
        onAnnotationDelete={(annotationId) => {
          console.log("Annotation deleted:", annotationId);
          // Sync with backend/storage
        }}
        onError={(error) => {
          console.error("PDF Viewer error:", error);
          // Log error for debugging
        }}
      />
    </div>
  );
};

export default PDFViewerPage;
