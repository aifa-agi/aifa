// @/app/(_service)/contexts/dialogs/provider.tsx

"use client";

import React, { createContext, ReactNode } from "react";
import { useDialogState } from "./hooks/use-dialog-state";
import { useKeywords } from "./hooks/use-keywords";
import { DialogsContextValue } from "./types";
import { useImages } from "./hooks/use-images";
import { DialogContent } from "./components/dialog-content";
import { generateCuid } from "@/lib/utils/generateCuid";

export const DialogsContext = createContext<DialogsContextValue | undefined>(
  undefined
);

export function DialogsProvider({ children }: { children: ReactNode }) {
  const dialogState = useDialogState();
  const keywords = useKeywords();
  const images = useImages();

  // Sync with dialog state
  React.useEffect(() => {
    if (dialogState.dialog.open) {
      keywords.setKeywordsList(dialogState.dialog.keywords ?? [""]);
      images.setImagesList(
        dialogState.dialog.images ?? [{ id: generateCuid(), alt: "", href: "" }]
      );
    } else {
      keywords.reset();
      images.reset();
    }
  }, [dialogState.dialog.open]);

  const contextValue: DialogsContextValue = {
    show: dialogState.show,
    close: dialogState.close,
    state: dialogState.dialog,
  };

  return (
    <DialogsContext.Provider value={contextValue}>
      {children}
      <DialogContent
        dialog={dialogState.dialog}
        input={dialogState.input}
        setInput={dialogState.setInput}
        onClose={dialogState.close}
        onConfirm={dialogState.handleConfirm}
        keywords={keywords}
        images={images}
      />
    </DialogsContext.Provider>
  );
}
