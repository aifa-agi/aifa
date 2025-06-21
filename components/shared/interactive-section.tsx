// @/components/interactive-section.tsx
import { HelpCircle, ArrowUpCircle } from "lucide-react";

interface InteractiveSectionProps {
  id: string;
  children: React.ReactNode;
  isSendMode: boolean;
  isHovered: boolean;
  isMobile: boolean;
  onHover: (id: string | null) => void;
  onActivate: (id: string) => void;
  onSend: (id: string) => void;
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
}: InteractiveSectionProps) {
  return (
    <section
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
          className="interaction-icon p-1 rounded-full bg-background hover:bg-accent"
          aria-label="Спросите ии"
          type="button"
        >
          <HelpCircle className="size-5 text-muted-foreground" />
        </button>
      )}
      {isSendMode && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSend(id);
          }}
          className="interaction-icon p-1 rounded-full bg-background hover:bg-accent"
          aria-label="Спросите ии"
          type="button"
          title={!isMobile ? "Спросите ии" : undefined}
        >
          <ArrowUpCircle className="size-5 text-white" />
        </button>
      )}
      {children}
    </section>
  );
}
