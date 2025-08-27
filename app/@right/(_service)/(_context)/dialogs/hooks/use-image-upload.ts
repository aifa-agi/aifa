// @/app/(_service)/contexts/dialogs/hooks/use-image-upload.ts
import { upload } from "@vercel/blob/client";
import { useState } from "react";
import { toast } from "sonner";

export function useImageUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadImage = async (file: File): Promise<string | null> => {
    // Validate file type - only images are allowed
    if (file.type.split("/")[0] !== "image") {
      toast.error("We only accept image files");
      return null;
    }

    // Validate file size - maximum 50MB
    if (file.size / 1024 / 1024 > 50) {
      toast.error("File size too big (max 50MB)");
      return null;
    }

    setIsUploading(true);
    setProgress(0);

    try {
      // Upload file to Vercel Blob storage
      const blob = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/upload",
        onUploadProgress: (progressEvent) => {
          setProgress(progressEvent.percentage);
        },
      });

      toast.success("Image uploaded successfully!");
      return blob.url;
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Upload error: ${error.message}`);
      } else {
        toast.error("Unknown error occurred during upload");
      }
      return null;
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  };

  return {
    uploadImage,
    isUploading,
    progress,
  };
}
