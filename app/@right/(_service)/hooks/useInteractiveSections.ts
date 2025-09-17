// @/hooks/useInteractiveSections.ts
import { useState, useEffect, useCallback } from "react";
import { useMediaQuery } from "./use-media-query";

export function useInteractiveSections() {
  const { isMobile } = useMediaQuery();
  const [sendModeSectionId, setSendModeSectionId] = useState<string | null>(
    null
  );
  const [hoveredSectionId, setHoveredSectionId] = useState<string | null>(null);

  const handleDocumentClick = useCallback((event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!target.closest(".interaction-icon")) {
      setSendModeSectionId(null);
    }
  }, []);

  useEffect(() => {
    if (!isMobile) {
      document.addEventListener("click", handleDocumentClick);
      return () => {
        document.removeEventListener("click", handleDocumentClick);
      };
    }
  }, [handleDocumentClick, isMobile]);

  return {
    sendModeSectionId,
    setSendModeSectionId,
    hoveredSectionId,
    setHoveredSectionId,
    isMobile,
  };
}
