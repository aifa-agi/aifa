// @/app/(_service)/contexts/dialogs/hooks/use-dialogs.ts

import { useContext } from "react";
import { DialogsContext } from "../provider";
import { DialogsContextValue } from "../types";

export function useDialogs(): DialogsContextValue {
  const context = useContext(DialogsContext);
  if (!context) {
    throw new Error("useDialogs must be used within DialogsProvider");
  }
  return context;
}
