"use client";

import * as React from "react";

import { CloudinaryImageUpload } from "@/components/cloudinary/cloudinary-image-upload";
import type { CloudinaryAsset } from "@/components/cloudinary/cloudinary-image-preview";
import { CLOUDINARY_FOLDERS } from "@/lib/cloudinary/client-folders";

export function ProductThumbnailField({
  initial,
}: {
  initial?: CloudinaryAsset | null;
}) {
  const [asset, setAsset] = React.useState<CloudinaryAsset | null>(
    initial ?? null,
  );
  return (
    <div className="space-y-2 sm:col-span-2">
      <p className="text-sm font-medium">Product thumbnail</p>
      <p className="text-xs text-muted-foreground">
        Upload the main product image to Cloudinary.
      </p>
      <CloudinaryImageUpload
        value={asset}
        onChange={setAsset}
        folder={CLOUDINARY_FOLDERS.products}
        label="Upload thumbnail"
      />
      <input type="hidden" name="thumbnailUrl" value={asset?.secureUrl ?? ""} />
      <input
        type="hidden"
        name="thumbnailPublicId"
        value={asset?.publicId ?? ""}
      />
      <input type="hidden" name="thumbnailWidth" value={asset?.width ?? ""} />
      <input type="hidden" name="thumbnailHeight" value={asset?.height ?? ""} />
      <input type="hidden" name="thumbnailFormat" value={asset?.format ?? ""} />
    </div>
  );
}
