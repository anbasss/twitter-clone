"use client";

import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";

interface ImageUploadProps {
  onChange: (base64: string) => void;
  label: string;
  value?: string;
  disabled?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onChange,
  label,
  value,
  disabled
}) => {
  const [base64, setBase64] = useState(value);

  // Sync internal state with prop
  useEffect(() => {
    if (value !== base64) {
      setBase64(value);
    }
  }, [value, base64]);

  const handleChange = useCallback((newBase64: string) => {
    setBase64(newBase64);
    onChange(newBase64);
  }, [onChange]);

  const handleDrop = useCallback((files: any) => {
    const file = files[0];
    const reader = new FileReader();
    
    reader.onload = (event: any) => {
      const result = event.target.result;
      setBase64(result);
      handleChange(result);
    };

    reader.readAsDataURL(file);
  }, [handleChange]);

  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setBase64('');
    onChange('');
  }, [onChange]);

  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    onDrop: handleDrop,
    disabled,
    accept: {
      'image/jpeg': [],
      'image/png': [],
    }
  });

  return (
    <div className="space-y-2">
      <div
        {...getRootProps({
          className: "w-full p-4 text-white text-center border-2 border-dotted rounded-md border-neutral-700 cursor-pointer"
        })}
      >
        <input {...getInputProps()} />
        {base64 ? (
          <div className="flex flex-col items-center justify-center">
            <Image
              src={base64}
              height={100}
              width={100}
              alt="Uploaded image"
              className="rounded-md"
            />
          </div>
        ) : (
          <p className="text-white">{label}</p>
        )}
      </div>
      {base64 && (
        <button
          onClick={handleDelete}
          className="text-red-500 hover:text-red-600 text-sm w-full"
          type="button"
          disabled={disabled}
        >
          Remove {label.toLowerCase()}
        </button>
      )}
    </div>
  );
};

export default ImageUpload;
