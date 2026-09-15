"use client";

import * as React from "react";
import { CloudinaryMultipleImageUpload } from "@/components/cloudinary/cloudinary-multiple-image-upload";
import type { CloudinaryAsset } from "@/components/cloudinary/cloudinary-image-preview";

export function ProductGalleryField({
  initial,
}: {
  initial: CloudinaryAsset[];
}) {
  const [assets, setAssets] = React.useState(initial);
  return (
    <div className="space-y-2 sm:col-span-2">
      <p className="text-sm font-medium">Product gallery</p>
      <CloudinaryMultipleImageUpload value={assets} onChange={setAssets} />
      <input
        type="hidden"
        name="galleryAssets"
        value={JSON.stringify(assets)}
      />
    </div>
  );
}
