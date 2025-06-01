"use client";

import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { HiOutlinePhotograph, HiOutlineVideoCamera, HiX } from "react-icons/hi";

interface MediaUploadProps {
  onChange: (file: File | null, type: 'image' | 'video' | null) => void;
  value?: { file: File; type: 'image' | 'video' } | null;
  disabled?: boolean;
}

const MediaUpload: React.FC<MediaUploadProps> = ({
  onChange,
  value,
  disabled
}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);

  useEffect(() => {
    if (value?.file) {
      const url = URL.createObjectURL(value.file);
      setPreview(url);
      setMediaType(value.type);
      
      return () => URL.revokeObjectURL(url);
    } else {
      setPreview(null);
      setMediaType(null);
    }
  }, [value]);

  const handleDrop = useCallback((files: File[]) => {
    const file = files[0];
    if (!file) return;

    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');

    if (isImage) {
      onChange(file, 'image');
    } else if (isVideo) {
      onChange(file, 'video');
    }
  }, [onChange]);

  const handleRemove = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null, null);
  }, [onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    disabled,
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
      'image/gif': ['.gif'],
      'image/webp': ['.webp'],
      'video/mp4': ['.mp4'],
      'video/webm': ['.webm'],
      'video/ogg': ['.ogg'],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB limit
  });

  return (
    <div className="w-full">
      {preview ? (
        <div className="relative rounded-lg overflow-hidden border border-neutral-700">
          {mediaType === 'image' ? (
            <Image
              src={preview}
              alt="Upload preview"
              width={500}
              height={300}
              className="w-full h-auto max-h-96 object-cover"
            />
          ) : (
            <video
              src={preview}
              controls
              className="w-full h-auto max-h-96"
              preload="metadata"
            >
              Your browser does not support the video tag.
            </video>
          )}
          <button
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-black bg-opacity-75 hover:bg-opacity-90 text-white rounded-full p-1.5 transition-colors"
            disabled={disabled}
          >
            <HiX size={20} />
          </button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
            ${isDragActive 
              ? 'border-blue-500 bg-blue-500 bg-opacity-10' 
              : 'border-neutral-700 hover:border-neutral-600'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center space-y-2">
            <div className="flex space-x-4">
              <HiOutlinePhotograph className="text-neutral-400" size={24} />
              <HiOutlineVideoCamera className="text-neutral-400" size={24} />
            </div>
            <p className="text-neutral-400 text-sm">
              {isDragActive
                ? "Drop your media here..."
                : "Click or drag photos/videos to upload"
              }
            </p>
            <p className="text-neutral-500 text-xs">
              JPG, PNG, GIF, WebP, MP4, WebM up to 10MB
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaUpload;
