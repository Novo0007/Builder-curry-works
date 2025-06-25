import React, { useRef, useEffect, useState, useCallback } from "react";
import { Loader2, AlertCircle, FileText } from "lucide-react";
import { Document, Page } from "react-pdf";
import { PDFViewerState, Annotation } from "@/types/pdf";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import "@/lib/pdfWorker";

interface PDFDocumentDisplayProps {
  file?: File | string;
  state: PDFViewerState;
  annotations: Annotation[];
  onDocumentLoadSuccess: (pdf: any) => void;
  onDocumentLoadError: (error: Error) => void;
  onPageLoadSuccess: (page: any) => void;
  onPageClick?: (event: React.MouseEvent, pageNumber: number) => void;
  className?: string;
}

export const PDFDocumentDisplay: React.FC<PDFDocumentDisplayProps> = ({
  file,
  state,
  annotations,
  onDocumentLoadSuccess,
  onDocumentLoadError,
  onPageLoadSuccess,
  onPageClick,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerDimensions, setContainerDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [pageScale, setPageScale] = useState(1);

  // Update container dimensions
  const updateDimensions = useCallback(() => {
    if (containerRef.current) {
      const { clientWidth, clientHeight } = containerRef.current;
      setContainerDimensions({ width: clientWidth, height: clientHeight });
    }
  }, []);

  useEffect(() => {
    updateDimensions();
    const resizeObserver = new ResizeObserver(updateDimensions);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    return () => resizeObserver.disconnect();
  }, [updateDimensions]);

  // Calculate page scale based on fit mode
  useEffect(() => {
    if (containerDimensions.width > 0) {
      const containerWidth = containerDimensions.width - 64; // Account for padding
      const containerHeight = containerDimensions.height - 64;

      let calculatedScale = state.scale;

      if (state.fitMode === "width") {
        // Assume standard page width of 600px at scale 1
        calculatedScale = containerWidth / 600;
      } else if (state.fitMode === "page") {
        // Assume standard page dimensions 600x800px at scale 1
        const widthScale = containerWidth / 600;
        const heightScale = containerHeight / 800;
        calculatedScale = Math.min(widthScale, heightScale);
      } else if (state.fitMode === "custom") {
        calculatedScale = state.scale;
      }

      setPageScale(calculatedScale);
    }
  }, [
    state.scale,
    state.fitMode,
    containerDimensions.width,
    containerDimensions.height,
  ]);

  const handleDocumentLoadSuccess = (pdf: any) => {
    onDocumentLoadSuccess(pdf);
  };

  const handleDocumentLoadError = (error: Error) => {
    console.error("Failed to load PDF:", error);
    onDocumentLoadError(error);
  };

  const handlePageClick = (event: React.MouseEvent, pageNumber: number) => {
    if (onPageClick) {
      onPageClick(event, pageNumber);
    }
  };

  const renderPageAnnotations = (pageNumber: number) => {
    const pageAnnotations = annotations.filter(
      (annotation) => annotation.pageNumber === pageNumber,
    );

    return pageAnnotations.map((annotation) => (
      <div
        key={annotation.id}
        className={cn(
          "absolute pointer-events-none",
          annotation.type === "highlight" && "bg-yellow-300/30",
          annotation.type === "note" && "bg-orange-300/30",
        )}
        style={{
          left: `${annotation.position.x * pageScale}px`,
          top: `${annotation.position.y * pageScale}px`,
          width: `${annotation.position.width * pageScale}px`,
          height: `${annotation.position.height * pageScale}px`,
          backgroundColor: annotation.color,
        }}
      >
        {annotation.content && (
          <div className="absolute top-full left-0 z-10 max-w-48 p-2 bg-popover border border-border rounded shadow-lg text-xs">
            {annotation.content}
          </div>
        )}
      </div>
    ));
  };

  const renderLoadingState = () => (
    <div className="flex items-center justify-center h-full">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading PDF document...</p>
      </div>
    </div>
  );

  const renderErrorState = () => (
    <div className="flex items-center justify-center h-full p-4">
      <Alert className="max-w-md">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {state.error || "Failed to load PDF document. Please try again."}
        </AlertDescription>
      </Alert>
    </div>
  );

  const renderEmptyState = () => (
    <div className="flex items-center justify-center h-full">
      <div className="flex flex-col items-center gap-4 text-muted-foreground">
        <FileText className="h-16 w-16" />
        <div className="text-center">
          <h3 className="text-lg font-semibold">No PDF loaded</h3>
          <p className="text-sm">
            Upload a PDF file to start viewing and annotating
          </p>
        </div>
      </div>
    </div>
  );

  const renderPage = (pageNumber: number) => {
    // Validate page number
    if (pageNumber < 1 || pageNumber > state.numPages) {
      return null;
    }

    return (
      <div
        key={pageNumber}
        className="relative mb-8 mx-auto"
        onClick={(e) => handlePageClick(e, pageNumber)}
      >
        <div className="pdf-page relative">
          <Page
            pageNumber={pageNumber}
            scale={pageScale}
            rotate={state.rotation}
            onLoadSuccess={onPageLoadSuccess}
            onLoadError={(error) => {
              console.warn(`Failed to load page ${pageNumber}:`, error);
            }}
            loading={
              <div className="flex items-center justify-center h-96 bg-muted/20 rounded">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            }
            error={
              <div className="flex items-center justify-center h-96 bg-destructive/10 rounded">
                <AlertCircle className="h-6 w-6 text-destructive" />
                <span className="ml-2 text-sm">
                  Failed to load page {pageNumber}
                </span>
              </div>
            }
          />
          {renderPageAnnotations(pageNumber)}

          {/* Search highlights would go here */}
          {state.searchResults
            .filter((result) => result.pageNumber === pageNumber)
            .map((result, index) => (
              <div
                key={index}
                className="absolute bg-primary/20 border border-primary rounded"
                style={{
                  left: `${result.boundingBox.x * pageScale}px`,
                  top: `${result.boundingBox.y * pageScale}px`,
                  width: `${result.boundingBox.width * pageScale}px`,
                  height: `${result.boundingBox.height * pageScale}px`,
                }}
              />
            ))}
        </div>

        {/* Page number indicator */}
        <div className="absolute bottom-2 right-2 bg-background/80 px-2 py-1 rounded text-xs text-muted-foreground">
          {pageNumber}
        </div>
      </div>
    );
  };

  if (!file) {
    return (
      <div className={cn("pdf-viewer-container h-full", className)}>
        {renderEmptyState()}
      </div>
    );
  }

  if (state.error) {
    return (
      <div className={cn("pdf-viewer-container h-full", className)}>
        {renderErrorState()}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn("pdf-viewer-container h-full relative", className)}
    >
      <Document
        file={file}
        onLoadSuccess={handleDocumentLoadSuccess}
        onLoadError={handleDocumentLoadError}
        loading={renderLoadingState()}
        error={renderErrorState()}
        className="h-full"
      >
        <ScrollArea className="h-full pdf-scrollbar">
          <div className="flex flex-col items-center py-8 px-4">
            {/* Render all pages for continuous scrolling */}
            {Array.from({ length: state.numPages }, (_, index) => index + 1)
              .slice(
                Math.max(0, state.currentPage - 3),
                Math.min(state.numPages, state.currentPage + 2),
              )
              .map((pageNumber) => renderPage(pageNumber))}
          </div>
        </ScrollArea>
      </Document>
    </div>
  );
};
