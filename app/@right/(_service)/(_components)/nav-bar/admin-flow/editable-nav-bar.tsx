// @/app/(_service)/components/nav-bar/admin-flow/editable-nav-bar.tsx

"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, MoreVertical, Loader2, ArrowLeft } from "lucide-react";
import EditableMobileMenu from "./editable-mobile-menu";

import { EditableWideMenu } from "./editable-wide-menu";
import { ModalProvider, useModal } from "../../../(_context)/modal-context";
import { DialogsProvider } from "../../../(_context)/dialogs";
import {
  useMenuOperations,
  useNavigationMenu,
} from "../../../(_context)/nav-bar-provider";
import { Button } from "@/components/ui/button";

const HEADER_HEIGHT = 56;
const MOBILE_MENU_OFFSET = 40;

function EditableNavBarContent() {
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  // Use modal context instead of local state
  const { isOpen, openModal, closeModal, toggleModal } = useModal();

  const { categories, setCategories, loading, dirty } = useNavigationMenu();

  const { handleUpdate, handleRetry, canRetry, retryCount, lastError } =
    useMenuOperations();

  const isAdminPagesRoute = pathname?.startsWith("/admin/pages") || false;

  useEffect(() => {
    const handleResize = () => setIsLargeScreen(window.innerWidth >= 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Remove body overflow effect from here since it's handled in context
  const mobileMenuTopOffset = `${MOBILE_MENU_OFFSET}px`;

  const handleMainButtonClick = async () => {
    if (!isAdminPagesRoute) {
      toggleModal();

      return;
    }

    if (dirty) {
      setIsSaving(true);
      try {
        const success = await handleUpdate();
        if (success) {
          openModal();
          router.back();
        }
      } catch (error) {
        console.error("Failed to save changes:", error);
      } finally {
        setIsSaving(false);
      }
    } else {
      openModal();
      router.back();
    }
  };

  const onUpdateClick = async () => {
    const success = await handleUpdate();

    if (!success && lastError) {
      console.log("Update failed in navbar:", lastError);
    }
  };

  const onRetryClick = async () => {
    const success = await handleRetry();
    if (!success) {
      console.log("Retry also failed in navbar");
    }
  };

  const getButtonVariant = () => {
    if (!isAdminPagesRoute) {
      return "destructive";
    }

    if (dirty) {
      return "default";
    }

    return "default";
  };

  const getButtonClassName = () => {
    if (!isAdminPagesRoute) {
      return "";
    }

    if (dirty) {
      return "bg-orange-600 hover:bg-orange-700 text-white";
    }

    return "bg-green-600 hover:bg-green-700 text-white";
  };

  const getButtonText = () => {
    if (!isAdminPagesRoute) {
      return isOpen ? "Close bar menu" : "Open bar menu";
    }

    if (isSaving) {
      return "Uploading Changes";
    }

    if (dirty) {
      return "Save and Return";
    }

    return "Return";
  };

  const getButtonIcon = () => {
    if (isSaving) {
      return <Loader2 className="w-4 h-4 animate-spin" />;
    }

    if (isAdminPagesRoute) {
      return <ArrowLeft className="w-4 h-4" />;
    }

    if (isLargeScreen) {
      return (
        <ChevronDown
          className={`size-4 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      );
    }

    return <MoreVertical className="size-5" />;
  };

  return (
    <DialogsProvider>
      <div>
        <div
          className={`flex items-center px-4 h-[56px] ${
            isLargeScreen ? "justify-end w-full" : "justify-start w-1/2"
          }`}
          style={{ minHeight: HEADER_HEIGHT, maxHeight: HEADER_HEIGHT }}
        >
          {isLargeScreen ? (
            <Button
              variant={getButtonVariant()}
              onClick={handleMainButtonClick}
              size="sm"
              className={`flex items-center gap-2 whitespace-nowrap px-4 ${getButtonClassName()}`}
              disabled={isSaving}
            >
              {getButtonIcon()}
              <span>{getButtonText()}</span>
            </Button>
          ) : (
            <Button
              variant={getButtonVariant()}
              onClick={handleMainButtonClick}
              className={`flex items-center justify-center px-2 ${getButtonClassName()}`}
              aria-label={getButtonText()}
              disabled={isSaving}
            >
              {getButtonIcon()}
            </Button>
          )}
        </div>

        {(!isAdminPagesRoute || isOpen) && (
          <>
            {isLargeScreen ? (
              <EditableWideMenu
                isOpen={isOpen}
                setIsOpen={() => toggleModal()}
                categories={categories}
                setCategories={setCategories}
                dirty={dirty}
                loading={loading}
                onUpdate={onUpdateClick}
                onRetry={onRetryClick}
                canRetry={canRetry}
                retryCount={retryCount}
                lastError={lastError}
              />
            ) : (
              <EditableMobileMenu
                isOpen={isOpen}
                setIsOpen={() => toggleModal()}
                topOffset={mobileMenuTopOffset}
                categories={categories}
                setCategories={setCategories}
              />
            )}
          </>
        )}
      </div>

      {isOpen && (
        <div
          className={`
            absolute inset-0 bg-black/50 backdrop-blur-sm
            transition-opacity duration-300 ease-in-out
            z-40
          `}
          style={{
            top: "64px",
          }}
          onClick={closeModal}
          aria-hidden="true"
        />
      )}
    </DialogsProvider>
  );
}

// Wrap the component with ModalProvider
export default function EditableNavBar() {
  return (
    <ModalProvider>
      <EditableNavBarContent />
    </ModalProvider>
  );
}
