// @/app/(_service)/contexts/dialogs/components/image-preview.tsx

import React, { useState, useEffect, memo, useRef } from "react";
import { Image as ImageIcon, AlertCircle, Plus, Upload } from "lucide-react";
import { useImageUpload } from "../hooks/use-image-upload";
import { ProgressBar } from "./progress-bar";

interface ImagePreviewProps {
  href?: string;
  alt?: string;
  onImageUploaded?: (url: string) => void;
  disabled?: boolean;
}

export const ImagePreview = memo(({ 
  href, 
  alt, 
  onImageUploaded,
  disabled = false 
}: ImagePreviewProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { uploadImage, isUploading, progress } = useImageUpload();

  // Reset image states when href changes
  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
  }, [href]);

  // Handle file selection and upload
  const handleFileChange = async (file: File) => {
    if (disabled || isUploading) return;
    
    const uploadedUrl = await uploadImage(file);
    if (uploadedUrl && onImageUploaded) {
      onImageUploaded(uploadedUrl);
    }
  };

  // Handle click to open file picker
  const handleClick = () => {
    if (!disabled && !isUploading && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle drag and drop functionality
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled || isUploading) return;

    const file = e.dataTransfer?.files?.[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && !isUploading) {
      setDragActive(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  // Empty state or loading state
  if (!href?.trim() || isUploading) {
    return (
      <div className="relative">
        <div 
          className={`w-20 h-20 bg-muted rounded border-2 ${
            dragActive 
              ? 'border-primary border-solid' 
              : 'border-dashed border-muted-foreground/30'
          } flex items-center justify-center cursor-pointer transition-all hover:border-muted-foreground/50 ${
            disabled ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={handleClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {isUploading ? (
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          ) : (
            <div className="flex flex-col items-center justify-center">
              <Plus className="w-4 h-4 text-muted-foreground/60 mb-1" />
              <Upload className="w-3 h-3 text-muted-foreground/60" />
            </div>
          )}
        </div>
        
        {/* Progress bar for upload */}
        {isUploading && (
          <div className="absolute -bottom-8 left-0 right-0">
            <ProgressBar value={progress} />
          </div>
        )}

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(event) => {
            const file = event.currentTarget?.files?.[0];
            if (file) {
              handleFileChange(file);
            }
          }}
          disabled={disabled || isUploading}
        />
      </div>
    );
  }

  // State with existing image
  return (
    <div className="relative group">
      <div className="w-20 h-20 bg-muted rounded border-2 border-solid border-border overflow-hidden relative">
        {!imageError ? (
          <>
            <img
              src={href}
              alt={alt || "Preview"}
              className={`w-full h-full object-cover transition-opacity duration-200 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => {
                setImageError(true);
                setImageLoaded(false);
              }}
            />
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-red-50">
            <AlertCircle className="w-6 h-6 text-red-500" />
          </div>
        )}
        
        {/* Overlay for replacing image */}
        {!disabled && (
          <div 
            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex items-center justify-center"
            onClick={handleClick}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <div className="text-white text-center">
              <Upload className="w-4 h-4 mx-auto mb-1" />
              <span className="text-xs">Replace</span>
            </div>
          </div>
        )}
      </div>

      {/* Hidden file input for replacement */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(event) => {
          const file = event.currentTarget?.files?.[0];
          if (file) {
            handleFileChange(file);
          }
        }}
        disabled={disabled}
      />
    </div>
  );
});

ImagePreview.displayName = 'ImagePreview';
