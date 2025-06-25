import { useEffect, useCallback } from "react";
import { KeyboardShortcut } from "@/types/pdf";

interface UseKeyboardShortcutsProps {
  shortcuts: KeyboardShortcut[];
  enabled?: boolean;
}

export const useKeyboardShortcuts = ({
  shortcuts,
  enabled = true,
}: UseKeyboardShortcutsProps) => {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      // Don't trigger shortcuts when typing in input fields
      const target = event.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.contentEditable === "true"
      ) {
        return;
      }

      const shortcut = shortcuts.find((s) => {
        const keyMatches = s.key.toLowerCase() === event.key.toLowerCase();
        const ctrlMatches = Boolean(s.ctrlKey) === event.ctrlKey;
        const shiftMatches = Boolean(s.shiftKey) === event.shiftKey;
        const altMatches = Boolean(s.altKey) === event.altKey;

        return keyMatches && ctrlMatches && shiftMatches && altMatches;
      });

      if (shortcut) {
        event.preventDefault();
        event.stopPropagation();
        shortcut.action();
      }
    },
    [shortcuts, enabled],
  );

  useEffect(() => {
    if (enabled) {
      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [handleKeyDown, enabled]);
};

// Common PDF viewer keyboard shortcuts
export const createPDFKeyboardShortcuts = (actions: {
  nextPage: () => void;
  previousPage: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  fitToWidth: () => void;
  fitToPage: () => void;
  toggleThumbnails: () => void;
  search: () => void;
  print: () => void;
  rotateClockwise: () => void;
  rotateCounterClockwise: () => void;
}): KeyboardShortcut[] => [
  {
    key: "ArrowRight",
    action: actions.nextPage,
    description: "Next page",
  },
  {
    key: "ArrowLeft",
    action: actions.previousPage,
    description: "Previous page",
  },
  {
    key: "PageDown",
    action: actions.nextPage,
    description: "Next page",
  },
  {
    key: "PageUp",
    action: actions.previousPage,
    description: "Previous page",
  },
  {
    key: " ",
    action: actions.nextPage,
    description: "Next page (Space)",
  },
  {
    key: " ",
    shiftKey: true,
    action: actions.previousPage,
    description: "Previous page (Shift+Space)",
  },
  {
    key: "=",
    ctrlKey: true,
    action: actions.zoomIn,
    description: "Zoom in",
  },
  {
    key: "+",
    ctrlKey: true,
    action: actions.zoomIn,
    description: "Zoom in",
  },
  {
    key: "-",
    ctrlKey: true,
    action: actions.zoomOut,
    description: "Zoom out",
  },
  {
    key: "0",
    ctrlKey: true,
    action: actions.fitToWidth,
    description: "Fit to width",
  },
  {
    key: "1",
    ctrlKey: true,
    action: actions.fitToPage,
    description: "Fit to page",
  },
  {
    key: "f",
    ctrlKey: true,
    action: actions.search,
    description: "Search",
  },
  {
    key: "p",
    ctrlKey: true,
    action: actions.print,
    description: "Print",
  },
  {
    key: "t",
    ctrlKey: true,
    action: actions.toggleThumbnails,
    description: "Toggle thumbnails",
  },
  {
    key: "r",
    ctrlKey: true,
    action: actions.rotateClockwise,
    description: "Rotate clockwise",
  },
  {
    key: "r",
    ctrlKey: true,
    shiftKey: true,
    action: actions.rotateCounterClockwise,
    description: "Rotate counter-clockwise",
  },
];
