import React, { useState, useMemo } from "react";
import { ChevronDown, ChevronRight, BookOpen, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { PDFOutlineItem } from "@/types/pdf";
import { cn } from "@/lib/utils";

interface PDFThumbnailSidebarProps {
  numPages: number;
  currentPage: number;
  isVisible: boolean;
  onPageClick: (page: number) => void;
  outline?: PDFOutlineItem[];
  searchResults?: Array<{ pageNumber: number; matchIndex: number }>;
  currentSearchIndex?: number;
}

export const PDFThumbnailSidebar: React.FC<PDFThumbnailSidebarProps> = ({
  numPages,
  currentPage,
  isVisible,
  onPageClick,
  outline = [],
  searchResults = [],
  currentSearchIndex = -1,
}) => {
  const [thumbnailFilter, setThumbnailFilter] = useState("");
  const [expandedOutlineItems, setExpandedOutlineItems] = useState<Set<string>>(
    new Set(),
  );

  const filteredPages = useMemo(() => {
    if (!thumbnailFilter) {
      return Array.from({ length: numPages }, (_, i) => i + 1);
    }
    const filterNum = parseInt(thumbnailFilter, 10);
    if (!isNaN(filterNum)) {
      return [filterNum].filter((page) => page >= 1 && page <= numPages);
    }
    return [];
  }, [numPages, thumbnailFilter]);

  const toggleOutlineItem = (itemId: string) => {
    const newExpanded = new Set(expandedOutlineItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedOutlineItems(newExpanded);
  };

  const renderOutlineItem = (item: PDFOutlineItem, index: number) => {
    const itemId = `${item.pageNumber}-${index}`;
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedOutlineItems.has(itemId);

    return (
      <div key={itemId} className="outline-item">
        <div
          className={cn(
            "flex items-center gap-2 px-2 py-1.5 text-sm cursor-pointer rounded hover:bg-accent",
            item.pageNumber === currentPage &&
              "bg-accent text-accent-foreground",
          )}
          style={{ paddingLeft: `${item.level * 16 + 8}px` }}
          onClick={() => onPageClick(item.pageNumber)}
        >
          {hasChildren && (
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0"
              onClick={(e) => {
                e.stopPropagation();
                toggleOutlineItem(itemId);
              }}
            >
              {isExpanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </Button>
          )}
          <span className="flex-1 truncate" title={item.title}>
            {item.title}
          </span>
          <span className="text-xs text-muted-foreground">
            {item.pageNumber}
          </span>
        </div>
        {hasChildren && isExpanded && (
          <div className="ml-2">
            {item.children!.map((child, childIndex) =>
              renderOutlineItem(child, childIndex),
            )}
          </div>
        )}
      </div>
    );
  };

  const renderSearchResults = () => {
    const resultsByPage = searchResults.reduce(
      (acc, result) => {
        if (!acc[result.pageNumber]) {
          acc[result.pageNumber] = [];
        }
        acc[result.pageNumber].push(result);
        return acc;
      },
      {} as Record<number, typeof searchResults>,
    );

    return Object.entries(resultsByPage).map(([pageNum, results]) => {
      const page = parseInt(pageNum, 10);
      const isCurrentResult = results.some(
        (r) => r.matchIndex === currentSearchIndex,
      );

      return (
        <div
          key={page}
          className={cn(
            "flex items-center justify-between px-3 py-2 text-sm cursor-pointer rounded hover:bg-accent",
            isCurrentResult && "bg-primary text-primary-foreground",
          )}
          onClick={() => onPageClick(page)}
        >
          <span>Page {page}</span>
          <Badge variant="secondary" className="text-xs">
            {results.length}
          </Badge>
        </div>
      );
    });
  };

  if (!isVisible) return null;

  return (
    <div className="w-64 border-r border-border bg-sidebar flex flex-col h-full">
      <div className="p-3 border-b border-border">
        <Tabs defaultValue="thumbnails" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="thumbnails" className="text-xs">
              Pages
            </TabsTrigger>
            <TabsTrigger value="outline" className="text-xs">
              Outline
            </TabsTrigger>
            <TabsTrigger value="search" className="text-xs">
              Search
            </TabsTrigger>
          </TabsList>

          <TabsContent value="thumbnails" className="mt-3">
            <div className="space-y-3">
              <Input
                placeholder="Filter pages..."
                value={thumbnailFilter}
                onChange={(e) => setThumbnailFilter(e.target.value)}
                className="h-8"
              />
              <ScrollArea className="h-[calc(100vh-200px)]">
                <div className="space-y-2 pr-2">
                  {filteredPages.map((pageNumber) => (
                    <div
                      key={pageNumber}
                      className={cn(
                        "pdf-thumbnail p-2 aspect-[3/4] relative",
                        pageNumber === currentPage && "active",
                      )}
                      onClick={() => onPageClick(pageNumber)}
                    >
                      {/* Skeleton/placeholder for PDF thumbnail */}
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded flex items-center justify-center">
                        <span className="text-xs font-medium text-muted-foreground">
                          {pageNumber}
                        </span>
                      </div>
                      <div className="absolute bottom-1 left-1 right-1 text-center">
                        <span className="text-xs bg-background/80 px-1 rounded">
                          {pageNumber}
                        </span>
                      </div>
                      {searchResults.some(
                        (r) => r.pageNumber === pageNumber,
                      ) && (
                        <div className="absolute top-1 right-1">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="outline" className="mt-3">
            <ScrollArea className="h-[calc(100vh-200px)]">
              {outline.length > 0 ? (
                <div className="space-y-1 pr-2">
                  {outline.map((item, index) => renderOutlineItem(item, index))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                  <BookOpen className="h-8 w-8 mb-2" />
                  <p className="text-sm">No outline available</p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="search" className="mt-3">
            <ScrollArea className="h-[calc(100vh-200px)]">
              {searchResults.length > 0 ? (
                <div className="space-y-1 pr-2">{renderSearchResults()}</div>
              ) : (
                <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                  <Search className="h-8 w-8 mb-2" />
                  <p className="text-sm">No search results</p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
