// @/app/(_service)/contexts/dialogs/types.ts

export type DialogType = 
  | "create"     
  | "edit"       
  | "confirm"   
  | "alert"      
  | "custom"
  | "delete"
export type InputType = "input" | "textarea" | "keywords" | "images";

export interface PageImages {
  id: string;
  alt?: string;
  href?: string;
}

export type DialogState =
  | {
      open: true;
      type: DialogType;
      inputType?: InputType;
      title: string;
      description?: string;
      value?: string;
      keywords?: string[];
      images?: PageImages[];
      placeholder?: string;
      onConfirm?: (value?: string, keywords?: string[], images?: PageImages[]) => void;
      onCancel?: () => void;
      confirmLabel?: string;
      cancelLabel?: string;
      confirmLoading?: boolean;
    }
  | { open: false };

export interface DialogShowOptions {
  type: DialogType;
  inputType?: InputType;
  title: string;
  description?: string;
  value?: string;
  keywords?: string[];
  images?: PageImages[];
  placeholder?: string;
  onConfirm?: (value?: string, keywords?: string[], images?: PageImages[]) => void;
  onCancel?: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmLoading?: boolean;
}

export interface DialogsContextValue {
  show: (options: DialogShowOptions) => void;
  close: () => void;
  state: DialogState;
}
