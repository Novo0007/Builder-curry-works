import React, { useEffect, useState } from "react";
import { PDFToolbar } from "./PDFToolbar";
import { PDFThumbnailSidebar } from "./PDFThumbnailSidebar";
import { PDFDocumentDisplay } from "./PDFDocumentDisplay";
import { PDFFileUpload } from "./PDFFileUpload";
import { usePDFViewer } from "@/hooks/usePDFViewer";
import {
  useKeyboardShortcuts,
  createPDFKeyboardShortcuts,
} from "@/hooks/useKeyboardShortcuts";
import { PDFViewerProps, PDFOutlineItem } from "@/types/pdf";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";

export const PDFViewer: React.FC<PDFViewerProps> = ({
  file: initialFile,
  initialPage = 1,
  initialScale = 1.0,
  enableAnnotations = true,
  enableSearch = true,
  enableThumbnails = true,
  enableOutline = true,
  enablePrint = true,
  enableDownload = true,
  onDocumentLoad,
  onPageChange,
  onZoomChange,
  onAnnotationAdd,
  onAnnotationUpdate,
  onAnnotationDelete,
  onError,
}) => {
  const { toast } = useToast();
  const [currentFile, setCurrentFile] = useState<File | string | undefined>(
    initialFile,
  );
  const [outline, setOutline] = useState<PDFOutlineItem[]>([]);

  const {
    state,
    document,
    annotations,
    zoomLevels,
    loadDocument,
    goToPage,
    nextPage,
    previousPage,
    setZoom,
    zoomIn,
    zoomOut,
    fitToWidth,
    fitToPage,
    rotateClockwise,
    search,
    nextSearchResult,
    previousSearchResult,
    addAnnotation,
    updateAnnotation,
    deleteAnnotation,
    toggleThumbnails,
    toggleTheme,
    canGoToPrevious,
    canGoToNext,
    hasSearchResults,
    currentSearchResult,
  } = usePDFViewer();

  // Set up keyboard shortcuts
  const keyboardShortcuts = createPDFKeyboardShortcuts({
    nextPage,
    previousPage,
    zoomIn,
    zoomOut,
    fitToWidth,
    fitToPage,
    toggleThumbnails,
    search: () => {
      // Focus search input
      const searchInput = document.querySelector(
        'input[placeholder*="Search"]',
      ) as HTMLInputElement;
      if (searchInput) {
        searchInput.focus();
      }
    },
    print: () => {
      if (enablePrint) {
        handlePrint();
      }
    },
    rotateClockwise,
    rotateCounterClockwise: rotateClockwise, // Same function for demo
  });

  useKeyboardShortcuts({
    shortcuts: keyboardShortcuts,
    enabled: !!currentFile,
  });

  // Load document when file changes
  useEffect(() => {
    if (currentFile) {
      loadDocument(currentFile);
    }
  }, [currentFile, loadDocument]);

  // Initialize with provided file
  useEffect(() => {
    if (initialFile) {
      setCurrentFile(initialFile);
    }
  }, [initialFile]);

  // Handle file selection
  const handleFileSelect = (file: File | string) => {
    setCurrentFile(file);
  };

  // Handle document load success
  const handleDocumentLoadSuccess = (pdf: any) => {
    console.log("PDF loaded successfully:", pdf);

    // Extract outline (in real implementation)
    const mockOutline: PDFOutlineItem[] = [
      {
        title: "Introduction",
        pageNumber: 1,
        level: 0,
        children: [
          { title: "Overview", pageNumber: 1, level: 1 },
          { title: "Getting Started", pageNumber: 2, level: 1 },
        ],
      },
      {
        title: "Main Content",
        pageNumber: 3,
        level: 0,
        children: [
          { title: "Features", pageNumber: 3, level: 1 },
          { title: "Examples", pageNumber: 5, level: 1 },
        ],
      },
      {
        title: "Conclusion",
        pageNumber: 8,
        level: 0,
      },
    ];
    setOutline(mockOutline);

    if (onDocumentLoad) {
      onDocumentLoad({
        file: currentFile!,
        numPages: pdf.numPages,
        title: "Sample PDF Document",
        author: "PDF Viewer Demo",
      });
    }

    toast({
      title: "Document loaded successfully",
      description: `${pdf.numPages} pages loaded`,
    });
  };

  // Handle document load error
  const handleDocumentLoadError = (error: Error) => {
    console.error("PDF load error:", error);
    if (onError) {
      onError(error);
    }

    toast({
      title: "Failed to load document",
      description: error.message,
      variant: "destructive",
    });
  };

  // Handle print
  const handlePrint = () => {
    if (currentFile) {
      window.print();
      toast({
        title: "Print dialog opened",
        description: "Select your print preferences",
      });
    }
  };

  // Handle download
  const handleDownload = () => {
    if (currentFile && typeof currentFile === "string") {
      // Create download link
      const link = document.createElement("a");
      link.href = currentFile;
      link.download = "document.pdf";
      link.click();

      toast({
        title: "Download started",
        description: "The PDF file is being downloaded",
      });
    } else if (currentFile instanceof File) {
      // Download the uploaded file
      const url = URL.createObjectURL(currentFile);
      const link = document.createElement("a");
      link.href = url;
      link.download = currentFile.name;
      link.click();
      URL.revokeObjectURL(url);

      toast({
        title: "Download started",
        description: "The PDF file is being downloaded",
      });
    }
  };

  // Handle page change events
  useEffect(() => {
    if (onPageChange) {
      onPageChange(state.currentPage);
    }
  }, [state.currentPage, onPageChange]);

  // Handle zoom change events
  useEffect(() => {
    if (onZoomChange) {
      onZoomChange(state.scale);
    }
  }, [state.scale, onZoomChange]);

  // Handle annotation events
  const handleAnnotationAdd = (annotation: any) => {
    addAnnotation(annotation);
    if (onAnnotationAdd) {
      onAnnotationAdd(annotation);
    }
  };

  const handleAnnotationUpdate = (annotation: any) => {
    updateAnnotation(annotation);
    if (onAnnotationUpdate) {
      onAnnotationUpdate(annotation);
    }
  };

  const handleAnnotationDelete = (annotationId: string) => {
    deleteAnnotation(annotationId);
    if (onAnnotationDelete) {
      onAnnotationDelete(annotationId);
    }
  };

  if (!currentFile) {
    return (
      <div className="pdf-viewer-container flex items-center justify-center min-h-screen p-8">
        <PDFFileUpload
          onFileSelect={handleFileSelect}
          onError={(error) => {
            toast({
              title: "Upload error",
              description: error,
              variant: "destructive",
            });
          }}
        />
      </div>
    );
  }

  return (
    <div className="pdf-viewer-container flex flex-col h-screen">
      {/* Toolbar */}
      <PDFToolbar
        state={state}
        zoomLevels={zoomLevels}
        onPageChange={goToPage}
        onNextPage={nextPage}
        onPreviousPage={previousPage}
        onZoomChange={setZoom}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onFitToWidth={fitToWidth}
        onFitToPage={fitToPage}
        onRotate={rotateClockwise}
        onSearch={search}
        onToggleThumbnails={toggleThumbnails}
        onToggleTheme={toggleTheme}
        onPrint={enablePrint ? handlePrint : () => {}}
        onDownload={enableDownload ? handleDownload : () => {}}
        canGoToPrevious={canGoToPrevious}
        canGoToNext={canGoToNext}
        hasSearchResults={hasSearchResults}
        currentSearchResult={currentSearchResult}
      />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {enableThumbnails && (
          <PDFThumbnailSidebar
            numPages={state.numPages}
            currentPage={state.currentPage}
            isVisible={state.showThumbnails}
            onPageClick={goToPage}
            outline={enableOutline ? outline : []}
            searchResults={state.searchResults}
            currentSearchIndex={state.currentSearchIndex}
          />
        )}

        {/* Document Display */}
        <div className="flex-1 relative">
          <PDFDocumentDisplay
            file={currentFile}
            state={state}
            annotations={enableAnnotations ? annotations : []}
            onDocumentLoadSuccess={handleDocumentLoadSuccess}
            onDocumentLoadError={handleDocumentLoadError}
            onPageLoadSuccess={(page) => {
              console.log("Page loaded:", page.pageNumber);
            }}
            onPageClick={(event, pageNumber) => {
              if (enableAnnotations) {
                // Handle annotation creation on click
                console.log("Page clicked:", pageNumber, event);
              }
            }}
          />
        </div>
      </div>

      <Toaster />
    </div>
  );
};
