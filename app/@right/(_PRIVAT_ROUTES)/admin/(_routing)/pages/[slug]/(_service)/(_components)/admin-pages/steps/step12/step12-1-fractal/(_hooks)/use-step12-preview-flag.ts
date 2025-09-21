// File: @/app/@right/(_PRIVAT_ROUTES)/admin/(_routing)/pages/[slug]/(_service)/(_components)/admin-pages/steps/step12/step12-1-fractal/(_hooks)/use-step12-preview-flag.ts
"use client";


import * as React from "react";
import { toast } from "sonner";
import { useNavigationMenu } from "@/app/@right/(_service)/(_context)/nav-bar-provider";
import type { PageData } from "@/app/@right/(_service)/(_types)/page-types";
import { STEP12_TEXTS } from "../(_constants)/step12-texts";
import { STEP12_IDS } from "../(_constants)/step12-ids";


type UsePreviewFlagProps = {
 page: PageData | null;
 categoryTitle: string;
};


type UsePreviewFlagReturn = {
 isUpdating: boolean;
 setCompleted: () => Promise<boolean>;
 unsetCompleted: () => Promise<boolean>;
 isCompleted: boolean;
 canUpdate: boolean;
};


export function useStep12PreviewFlag({ page, categoryTitle }: UsePreviewFlagProps): UsePreviewFlagReturn {
 const { setCategories, updateCategories } = useNavigationMenu();
 const [isUpdating, setIsUpdating] = React.useState(false);


 const isPageValid = Boolean(page && page.id);
 const isCompleted = Boolean(page?.isPreviewComplited);
 const canUpdate = !isUpdating && isPageValid;


 const setCompleted = React.useCallback(async (): Promise<boolean> => {
   if (!isPageValid || !page) {
     toast.error(STEP12_TEXTS.preview.missingPageTitle, {
       id: STEP12_IDS.toasts.previewMissing,
       description: STEP12_TEXTS.preview.missingPageDescription,
     });
     return false;
   }
   if (isUpdating) return false;
   if (page.isPreviewComplited) {
     toast.message(STEP12_TEXTS.preview.completedSetTitle, {
       id: STEP12_IDS.toasts.previewSet,
       description: STEP12_TEXTS.preview.completedSetDescription,
     });
     return true;
   }


   setIsUpdating(true);
   try {
     const updatedPage: PageData = {
       ...page,
       isPreviewComplited: true,
       updatedAt: new Date().toISOString(),
     };


     // Optimistic
     setCategories((prev) =>
       prev.map((cat) =>
         cat.title !== categoryTitle
           ? cat
           : { ...cat, pages: cat.pages.map((p) => (p.id !== page.id ? p : updatedPage)) }
       )
     );


     const updateError = await updateCategories();
     if (updateError) {
       // Rollback
       setCategories((prev) =>
         prev.map((cat) =>
           cat.title !== categoryTitle
             ? cat
             : {
                 ...cat,
                 pages: cat.pages.map((p) =>
                   p.id !== page.id ? p : { ...p, isPreviewComplited: false }
                 ),
               }
         )
       );


       toast.error(STEP12_TEXTS.save.errorTitle, {
         id: STEP12_IDS.toasts.saveError,
         description: updateError.userMessage ?? STEP12_TEXTS.save.errorDescription,
       });
       toast.warning(STEP12_TEXTS.save.rollbackTitle, {
         id: STEP12_IDS.toasts.rollback,
         description: STEP12_TEXTS.save.rollbackDescription,
       });
       return false;
     }


     toast.success(STEP12_TEXTS.preview.completedSetTitle, {
       id: STEP12_IDS.toasts.previewSet,
       description: STEP12_TEXTS.preview.completedSetDescription,
     });
     return true;
   } catch {
     toast.error(STEP12_TEXTS.save.errorTitle, {
       id: STEP12_IDS.toasts.saveError,
       description: STEP12_TEXTS.save.errorDescription,
     });
     return false;
   } finally {
     setIsUpdating(false);
   }
 }, [isPageValid, page, categoryTitle, setCategories, updateCategories]);


 const unsetCompleted = React.useCallback(async (): Promise<boolean> => {
   if (!isPageValid || !page) {
     toast.error(STEP12_TEXTS.preview.missingPageTitle, {
       id: STEP12_IDS.toasts.previewMissing,
       description: STEP12_TEXTS.preview.missingPageDescription,
     });
     return false;
   }
   if (isUpdating) return false;
   if (!page.isPreviewComplited) {
     toast.message(STEP12_TEXTS.preview.completedUnsetTitle, {
       id: STEP12_IDS.toasts.previewUnset,
       description: STEP12_TEXTS.preview.completedUnsetDescription,
     });
     return true;
   }


   setIsUpdating(true);
   try {
     const updatedPage: PageData = {
       ...page,
       isPreviewComplited: false,
       updatedAt: new Date().toISOString(),
     };


     // Optimistic
     setCategories((prev) =>
       prev.map((cat) =>
         cat.title !== categoryTitle
           ? cat
           : { ...cat, pages: cat.pages.map((p) => (p.id !== page.id ? p : updatedPage)) }
       )
     );


     const updateError = await updateCategories();
     if (updateError) {
       // Rollback
       setCategories((prev) =>
         prev.map((cat) =>
           cat.title !== categoryTitle
             ? cat
             : {
                 ...cat,
                 pages: cat.pages.map((p) =>
                   p.id !== page.id ? p : { ...p, isPreviewComplited: true }
                 ),
               }
         )
       );


       toast.error(STEP12_TEXTS.save.errorTitle, {
         id: STEP12_IDS.toasts.saveError,
         description: updateError.userMessage ?? STEP12_TEXTS.save.errorDescription,
       });
       toast.warning(STEP12_TEXTS.save.rollbackTitle, {
         id: STEP12_IDS.toasts.rollback,
         description: STEP12_TEXTS.save.rollbackDescription,
       });
       return false;
     }


     toast.success(STEP12_TEXTS.preview.completedUnsetTitle, {
       id: STEP12_IDS.toasts.previewUnset,
       description: STEP12_TEXTS.preview.completedUnsetDescription,
     });
     return true;
   } catch {
     toast.error(STEP12_TEXTS.save.errorTitle, {
       id: STEP12_IDS.toasts.saveError,
       description: STEP12_TEXTS.save.errorDescription,
     });
     return false;
   } finally {
     setIsUpdating(false);
   }
 }, [isPageValid, page, categoryTitle, setCategories, updateCategories]);


 return { isUpdating, setCompleted, unsetCompleted, isCompleted, canUpdate };
}


