import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Search,
  Download,
  Printer,
  Menu,
  Sun,
  Moon,
  Maximize,
  Minimize,
  PanelLeftOpen,
  PanelLeftClose,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { PDFViewerState, ZoomLevel } from "@/types/pdf";

interface PDFToolbarProps {
  state: PDFViewerState;
  zoomLevels: ZoomLevel[];
  onPageChange: (page: number) => void;
  onNextPage: () => void;
  onPreviousPage: () => void;
  onZoomChange: (scale: number) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitToWidth: () => void;
  onFitToPage: () => void;
  onRotate: () => void;
  onSearch: (term: string) => void;
  onToggleThumbnails: () => void;
  onToggleTheme: () => void;
  onPrint: () => void;
  onDownload: () => void;
  canGoToPrevious: boolean;
  canGoToNext: boolean;
  hasSearchResults: boolean;
  currentSearchResult?: { pageNumber: number; matchIndex: number } | null;
}

export const PDFToolbar: React.FC<PDFToolbarProps> = ({
  state,
  zoomLevels,
  onPageChange,
  onNextPage,
  onPreviousPage,
  onZoomChange,
  onZoomIn,
  onZoomOut,
  onFitToWidth,
  onFitToPage,
  onRotate,
  onSearch,
  onToggleThumbnails,
  onToggleTheme,
  onPrint,
  onDownload,
  canGoToPrevious,
  canGoToNext,
  hasSearchResults,
  currentSearchResult,
}) => {
  const [pageInput, setPageInput] = useState(state.currentPage.toString());
  const [searchInput, setSearchInput] = useState(state.searchTerm);
  const [showSearch, setShowSearch] = useState(false);

  const handlePageInputChange = (value: string) => {
    setPageInput(value);
  };

  const handlePageInputSubmit = () => {
    const pageNumber = parseInt(pageInput, 10);
    if (pageNumber >= 1 && pageNumber <= state.numPages) {
      onPageChange(pageNumber);
    } else {
      setPageInput(state.currentPage.toString());
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchInput);
  };

  const handleZoomSelect = (value: string) => {
    const zoomLevel = zoomLevels.find((z) => z.label === value);
    if (zoomLevel) {
      if (zoomLevel.type === "fit") {
        if (zoomLevel.label === "Fit Width") {
          onFitToWidth();
        } else if (zoomLevel.label === "Fit Page") {
          onFitToPage();
        }
      } else {
        onZoomChange(zoomLevel.value);
      }
    }
  };

  const getCurrentZoomLabel = () => {
    const matchingLevel = zoomLevels.find(
      (z) => z.type === "preset" && Math.abs(z.value - state.scale) < 0.01,
    );
    if (matchingLevel) return matchingLevel.label;

    if (state.fitMode === "width") return "Fit Width";
    if (state.fitMode === "page") return "Fit Page";

    return `${Math.round(state.scale * 100)}%`;
  };

  return (
    <div className="pdf-toolbar flex items-center justify-between px-4 py-3 h-16">
      <div className="flex items-center gap-2">
        {/* Sidebar Toggle */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleThumbnails}
              className="h-8 w-8 p-0"
            >
              {state.showThumbnails ? (
                <PanelLeftClose className="h-4 w-4" />
              ) : (
                <PanelLeftOpen className="h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {state.showThumbnails ? "Hide thumbnails" : "Show thumbnails"}
          </TooltipContent>
        </Tooltip>

        <Separator orientation="vertical" className="h-6" />

        {/* Page Navigation */}
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onPreviousPage}
                disabled={!canGoToPrevious}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Previous page (←)</TooltipContent>
          </Tooltip>

          <div className="flex items-center gap-1 px-2">
            <Input
              type="number"
              value={pageInput}
              onChange={(e) => handlePageInputChange(e.target.value)}
              onBlur={handlePageInputSubmit}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handlePageInputSubmit();
                }
              }}
              className="w-16 h-8 text-center text-sm"
              min={1}
              max={state.numPages}
            />
            <span className="text-sm text-muted-foreground">
              of {state.numPages}
            </span>
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onNextPage}
                disabled={!canGoToNext}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Next page (→)</TooltipContent>
          </Tooltip>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Zoom Controls */}
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onZoomOut}
                className="h-8 w-8 p-0"
                disabled={state.scale <= 0.25}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Zoom out (Ctrl+-)</TooltipContent>
          </Tooltip>

          <Select
            value={getCurrentZoomLabel()}
            onValueChange={handleZoomSelect}
          >
            <SelectTrigger className="w-24 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {zoomLevels.map((zoom) => (
                <SelectItem key={zoom.label} value={zoom.label}>
                  {zoom.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onZoomIn}
                className="h-8 w-8 p-0"
                disabled={state.scale >= 5.0}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Zoom in (Ctrl++)</TooltipContent>
          </Tooltip>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Rotate */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={onRotate}
              className="h-8 w-8 p-0"
            >
              <RotateCw className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Rotate clockwise (Ctrl+R)</TooltipContent>
        </Tooltip>
      </div>

      {/* Center - Search */}
      <div className="flex items-center gap-2">
        {showSearch ? (
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center gap-2"
          >
            <Input
              type="text"
              placeholder="Search in document..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-64 h-8"
              autoFocus
            />
            {hasSearchResults && (
              <Badge variant="secondary" className="text-xs">
                {state.currentSearchIndex + 1} of {state.searchResults.length}
              </Badge>
            )}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowSearch(false);
                setSearchInput("");
                onSearch("");
              }}
              className="h-8 w-8 p-0"
            >
              ×
            </Button>
          </form>
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSearch(true)}
                className="h-8 w-8 p-0"
              >
                <Search className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Search (Ctrl+F)</TooltipContent>
          </Tooltip>
        )}
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={onPrint}
              className="h-8 w-8 p-0"
            >
              <Printer className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Print (Ctrl+P)</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDownload}
              className="h-8 w-8 p-0"
            >
              <Download className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Download</TooltipContent>
        </Tooltip>

        <Separator orientation="vertical" className="h-6" />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleTheme}
              className="h-8 w-8 p-0"
            >
              {state.theme === "light" ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {state.theme === "light" ? "Dark mode" : "Light mode"}
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};
