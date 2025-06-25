export interface PDFDocument {
  file: File | string;
  numPages: number;
  title?: string;
  author?: string;
  subject?: string;
  keywords?: string;
  creator?: string;
  producer?: string;
  creationDate?: Date;
  modificationDate?: Date;
}

export interface PDFPage {
  pageNumber: number;
  width: number;
  height: number;
  scale: number;
  rotation: number;
}

export interface PDFViewerState {
  currentPage: number;
  numPages: number;
  scale: number;
  rotation: number;
  fitMode: "width" | "height" | "page" | "auto" | "custom";
  isLoading: boolean;
  error: string | null;
  searchTerm: string;
  searchResults: SearchResult[];
  currentSearchIndex: number;
  showThumbnails: boolean;
  showOutline: boolean;
  theme: "light" | "dark";
}

export interface SearchResult {
  pageNumber: number;
  textContent: string;
  matchIndex: number;
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface Annotation {
  id: string;
  type: "highlight" | "note" | "rectangle" | "circle" | "arrow";
  pageNumber: number;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  content?: string;
  color: string;
  author?: string;
  createdAt: Date;
  modifiedAt: Date;
}

export interface AnnotationStyle {
  color: string;
  opacity: number;
  strokeWidth?: number;
  fontSize?: number;
}

export interface PDFOutlineItem {
  title: string;
  pageNumber: number;
  level: number;
  children?: PDFOutlineItem[];
  expanded?: boolean;
}

export interface ZoomLevel {
  label: string;
  value: number;
  type: "preset" | "fit";
}

export interface PDFViewerProps {
  file?: File | string;
  initialPage?: number;
  initialScale?: number;
  enableAnnotations?: boolean;
  enableSearch?: boolean;
  enableThumbnails?: boolean;
  enableOutline?: boolean;
  enablePrint?: boolean;
  enableDownload?: boolean;
  onDocumentLoad?: (document: PDFDocument) => void;
  onPageChange?: (pageNumber: number) => void;
  onZoomChange?: (scale: number) => void;
  onAnnotationAdd?: (annotation: Annotation) => void;
  onAnnotationUpdate?: (annotation: Annotation) => void;
  onAnnotationDelete?: (annotationId: string) => void;
  onError?: (error: Error) => void;
}

export interface ToolbarAction {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
  shortcut?: string;
}

export interface PrintOptions {
  pageRange: "all" | "current" | "range";
  startPage?: number;
  endPage?: number;
  copies: number;
  orientation: "portrait" | "landscape";
  paperSize: "a4" | "letter" | "legal" | "a3";
}

export interface FileUploadState {
  isDragOver: boolean;
  isUploading: boolean;
  progress: number;
  error: string | null;
}

export interface VirtualScrollItem {
  index: number;
  pageNumber: number;
  height: number;
  width: number;
  offsetTop: number;
  isVisible: boolean;
}

export interface PDFWorkerMessage {
  type: "loadDocument" | "renderPage" | "searchText" | "getOutline";
  payload: any;
  requestId: string;
}

export interface PDFWorkerResponse {
  type:
    | "documentLoaded"
    | "pageRendered"
    | "searchResults"
    | "outline"
    | "error";
  payload: any;
  requestId: string;
}

export interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  action: () => void;
  description: string;
}

export interface PDFViewerError {
  code:
    | "INVALID_PDF"
    | "LOAD_ERROR"
    | "RENDER_ERROR"
    | "SEARCH_ERROR"
    | "ANNOTATION_ERROR";
  message: string;
  details?: any;
}
