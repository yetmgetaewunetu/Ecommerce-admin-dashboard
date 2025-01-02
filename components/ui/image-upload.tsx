import Image from "next/image";
import React, { useEffect, useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { Button } from "@/components/ui/button";
import { ImagePlus, Trash } from "lucide-react";

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[];
  uploadPreset?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  disabled,
  onChange,
  onRemove,
  value,
  uploadPreset = "adminDashboard",
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const onUpload = (result: any) => {
    if (result.event === "success") {
      console.log("Uploaded image URL:", result.info.secure_url);
      onChange(result.info.secure_url);
    } else {
      console.error("Image upload failed:", result);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        {value.map((url) => (
          <div
            key={url}
            className="relative w-[200px] h-[200px] rounded-md overflow-hidden"
          >
            <div className="absolute z-10 top-2 right-2">
              <Button
                type="button"
                onClick={() => onRemove(url)}
                variant="destructive"
                size="icon"
                aria-label="Remove image"
                disabled={disabled}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
            <Image
              fill
              key={url}
              className="object-cover"
              alt="Uploaded image"
              src={url}
              loading="lazy"
            />
          </div>
        ))}
      </div>
      <CldUploadWidget
        uploadPreset={uploadPreset}
        onError={(error) => {
          console.error("Upload error:", error);
        }}
        onSuccess={(result) => {
          console.log("Upload successful:", result); // Debug: Log the result
          onUpload(result);
        }}
      >
        {({ open }) => (
          <Button
            type="button"
            variant="secondary"
            onClick={() => open()}
            disabled={disabled}
          >
            <ImagePlus className="w-4 h-4 mr-2" />
            Upload image
          </Button>
        )}
      </CldUploadWidget>
    </div>
  );
};

export default ImageUpload;
