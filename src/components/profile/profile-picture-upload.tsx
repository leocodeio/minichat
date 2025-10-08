"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, Camera } from "lucide-react";
import { toast } from "sonner";

interface ProfilePictureUploadProps {
  currentImage?: string;
  userName: string;
  onUpload: (file: File) => Promise<void>;
}

export function ProfilePictureUpload({ currentImage, userName, onUpload }: ProfilePictureUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload the file
    handleUpload(file);
  };

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    try {
      await onUpload(file);
      toast.success("Profile picture updated successfully!");
      setPreview(null);
      } catch (_error) {
      toast.error("Failed to upload profile picture");
      setPreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Picture</CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <div className="relative inline-block">
          <Avatar className="w-32 h-32 mx-auto">
            <AvatarImage src={preview || currentImage} alt={userName} />
            <AvatarFallback className="text-3xl">
              {userName?.charAt(0)?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <Button
            size="sm"
            variant="secondary"
            className="absolute bottom-0 right-0 rounded-full w-10 h-10 p-0"
            onClick={triggerFileInput}
            disabled={isUploading}
          >
            <Camera className="w-4 h-4" />
          </Button>
        </div>

        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <Button
            onClick={triggerFileInput}
            disabled={isUploading}
            variant="outline"
          >
            <Upload className="w-4 h-4 mr-2" />
            {isUploading ? "Uploading..." : "Change Picture"}
          </Button>
        </div>

        <p className="text-sm text-muted-foreground">
          Upload a new profile picture. Max size: 5MB
        </p>
      </CardContent>
    </Card>
  );
}