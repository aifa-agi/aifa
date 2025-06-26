// @/components/interactive-section.tsx

import { HelpCircle, ArrowUpCircle } from "lucide-react";
import { Ref } from "react";

interface InteractiveSectionProps {
  id: string;
  children: React.ReactNode;
  isSendMode: boolean;
  isHovered: boolean;
  isMobile: boolean;
  onHover: (id: string | null) => void;
  onActivate: (id: string) => void;
  onSend: (id: string) => void;
  ref?: Ref<HTMLElement>;
}

export function InteractiveSection({
  id,
  children,
  isSendMode,
  isHovered,
  isMobile,
  onHover,
  onActivate,
  onSend,
  ref,
}: InteractiveSectionProps) {
  return (
    <section
      ref={ref}
      data-interactive-id={id}
      className={`interactive-section${isSendMode ? "  text-primary" : ""}`}
      onMouseEnter={() => {
        if (!isMobile) onHover(id);
      }}
      onMouseLeave={() => {
        if (!isMobile) onHover(null);
      }}
      onClick={() => {
        if (isMobile && !isSendMode) {
          onActivate(id);
        }
      }}
    >
      {!isMobile && isHovered && !isSendMode && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onActivate(id);
          }}
          className="interaction-icon p-1 rounded-full hover:bg-primary "
          aria-label="ASK AI"
          type="button"
        >
          <HelpCircle className="size-5 text-muted-foreground hover:text-white" />
        </button>
      )}
      {isSendMode && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSend(id);
          }}
          className="interaction-arrow-icon p-1 rounded-full  bg-primary"
          aria-label="ASK AI"
          type="button"
          title={!isMobile ? "ASK CHAT GPT" : undefined}
        >
          <ArrowUpCircle className="size-5 text-white " />
        </button>
      )}
      {children}
    </section>
  );
}
