import { useState, useCallback, useEffect, useRef } from "react";
import {
  PDFViewerState,
  PDFDocument,
  SearchResult,
  Annotation,
  PDFViewerError,
  ZoomLevel,
} from "@/types/pdf";

const ZOOM_LEVELS: ZoomLevel[] = [
  { label: "25%", value: 0.25, type: "preset" },
  { label: "50%", value: 0.5, type: "preset" },
  { label: "75%", value: 0.75, type: "preset" },
  { label: "100%", value: 1.0, type: "preset" },
  { label: "125%", value: 1.25, type: "preset" },
  { label: "150%", value: 1.5, type: "preset" },
  { label: "200%", value: 2.0, type: "preset" },
  { label: "300%", value: 3.0, type: "preset" },
  { label: "400%", value: 4.0, type: "preset" },
  { label: "500%", value: 5.0, type: "preset" },
  { label: "Fit Width", value: 0, type: "fit" },
  { label: "Fit Page", value: 0, type: "fit" },
];

export const usePDFViewer = () => {
  const [state, setState] = useState<PDFViewerState>({
    currentPage: 1,
    numPages: 0,
    scale: 1.0,
    rotation: 0,
    fitMode: "width",
    isLoading: false,
    error: null,
    searchTerm: "",
    searchResults: [],
    currentSearchIndex: -1,
    showThumbnails: true,
    showOutline: false,
    theme: "light",
  });

  const [document, setDocument] = useState<PDFDocument | null>(null);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  // Update state helper
  const updateState = useCallback((updates: Partial<PDFViewerState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  // Document loading
  const loadDocument = useCallback(
    async (file: File | string): Promise<void> => {
      updateState({ isLoading: true, error: null });

      try {
        // This would integrate with react-pdf
        // For now, we'll simulate document loading
        const mockDocument: PDFDocument = {
          file,
          numPages: 10, // Mock value
          title: "Sample PDF Document",
          author: "PDF Viewer",
          subject: "Document Preview",
          creationDate: new Date(),
        };

        setDocument(mockDocument);
        updateState({
          numPages: mockDocument.numPages,
          isLoading: false,
          currentPage: 1,
        });
      } catch (error) {
        const pdfError: PDFViewerError = {
          code: "LOAD_ERROR",
          message: "Failed to load PDF document",
          details: error,
        };
        updateState({ error: pdfError.message, isLoading: false });
      }
    },
    [updateState],
  );

  // Page navigation
  const goToPage = useCallback(
    (pageNumber: number) => {
      if (pageNumber >= 1 && pageNumber <= state.numPages) {
        updateState({ currentPage: pageNumber });
      }
    },
    [state.numPages, updateState],
  );

  const nextPage = useCallback(() => {
    goToPage(state.currentPage + 1);
  }, [state.currentPage, goToPage]);

  const previousPage = useCallback(() => {
    goToPage(state.currentPage - 1);
  }, [state.currentPage, goToPage]);

  // Zoom controls
  const setZoom = useCallback(
    (scale: number) => {
      updateState({ scale, fitMode: "custom" });
    },
    [updateState],
  );

  const zoomIn = useCallback(() => {
    const newScale = Math.min(state.scale * 1.25, 5.0);
    setZoom(newScale);
  }, [state.scale, setZoom]);

  const zoomOut = useCallback(() => {
    const newScale = Math.max(state.scale * 0.8, 0.25);
    setZoom(newScale);
  }, [state.scale, setZoom]);

  const fitToWidth = useCallback(() => {
    updateState({ fitMode: "width", scale: 1.0 });
  }, [updateState]);

  const fitToPage = useCallback(() => {
    updateState({ fitMode: "page", scale: 1.0 });
  }, [updateState]);

  // Rotation
  const rotateClockwise = useCallback(() => {
    const newRotation = (state.rotation + 90) % 360;
    updateState({ rotation: newRotation });
  }, [state.rotation, updateState]);

  const rotateCounterClockwise = useCallback(() => {
    const newRotation = (state.rotation - 90 + 360) % 360;
    updateState({ rotation: newRotation });
  }, [state.rotation, updateState]);

  // Search functionality
  const search = useCallback(
    async (searchTerm: string): Promise<void> => {
      if (!searchTerm.trim()) {
        updateState({
          searchTerm: "",
          searchResults: [],
          currentSearchIndex: -1,
        });
        return;
      }

      // Clear previous search timeout
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      // Debounce search
      searchTimeoutRef.current = setTimeout(async () => {
        try {
          // Mock search results - in real implementation, this would use react-pdf search
          const mockResults: SearchResult[] = [
            {
              pageNumber: 1,
              textContent: searchTerm,
              matchIndex: 0,
              boundingBox: { x: 100, y: 200, width: 80, height: 20 },
            },
            {
              pageNumber: 3,
              textContent: searchTerm,
              matchIndex: 1,
              boundingBox: { x: 150, y: 300, width: 80, height: 20 },
            },
          ];

          updateState({
            searchTerm,
            searchResults: mockResults,
            currentSearchIndex: mockResults.length > 0 ? 0 : -1,
          });

          // Navigate to first result
          if (mockResults.length > 0) {
            goToPage(mockResults[0].pageNumber);
          }
        } catch (error) {
          console.error("Search error:", error);
        }
      }, 300);
    },
    [updateState, goToPage],
  );

  const nextSearchResult = useCallback(() => {
    if (state.searchResults.length === 0) return;

    const nextIndex =
      (state.currentSearchIndex + 1) % state.searchResults.length;
    const result = state.searchResults[nextIndex];

    updateState({ currentSearchIndex: nextIndex });
    goToPage(result.pageNumber);
  }, [state.searchResults, state.currentSearchIndex, updateState, goToPage]);

  const previousSearchResult = useCallback(() => {
    if (state.searchResults.length === 0) return;

    const prevIndex =
      state.currentSearchIndex === 0
        ? state.searchResults.length - 1
        : state.currentSearchIndex - 1;
    const result = state.searchResults[prevIndex];

    updateState({ currentSearchIndex: prevIndex });
    goToPage(result.pageNumber);
  }, [state.searchResults, state.currentSearchIndex, updateState, goToPage]);

  // Annotation management
  const addAnnotation = useCallback((annotation: Omit<Annotation, "id">) => {
    const newAnnotation: Annotation = {
      ...annotation,
      id: crypto.randomUUID(),
    };
    setAnnotations((prev) => [...prev, newAnnotation]);
  }, []);

  const updateAnnotation = useCallback((annotation: Annotation) => {
    setAnnotations((prev) =>
      prev.map((a) => (a.id === annotation.id ? annotation : a)),
    );
  }, []);

  const deleteAnnotation = useCallback((annotationId: string) => {
    setAnnotations((prev) => prev.filter((a) => a.id !== annotationId));
  }, []);

  // UI toggles
  const toggleThumbnails = useCallback(() => {
    updateState({ showThumbnails: !state.showThumbnails });
  }, [state.showThumbnails, updateState]);

  const toggleOutline = useCallback(() => {
    updateState({ showOutline: !state.showOutline });
  }, [state.showOutline, updateState]);

  const toggleTheme = useCallback(() => {
    const newTheme = state.theme === "light" ? "dark" : "light";
    updateState({ theme: newTheme });
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  }, [state.theme, updateState]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return {
    // State
    state,
    document,
    annotations,
    zoomLevels: ZOOM_LEVELS,

    // Actions
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
    rotateCounterClockwise,
    search,
    nextSearchResult,
    previousSearchResult,
    addAnnotation,
    updateAnnotation,
    deleteAnnotation,
    toggleThumbnails,
    toggleOutline,
    toggleTheme,

    // Computed values
    canGoToPrevious: state.currentPage > 1,
    canGoToNext: state.currentPage < state.numPages,
    hasSearchResults: state.searchResults.length > 0,
    currentSearchResult:
      state.currentSearchIndex >= 0
        ? state.searchResults[state.currentSearchIndex]
        : null,
  };
};
