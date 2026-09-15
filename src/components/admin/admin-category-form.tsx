"use client";

import Link from "next/link";
import {
  createCategoryAction,
  updateCategoryAction,
} from "@/lib/admin-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CloudinaryImageUpload } from "@/components/cloudinary/cloudinary-image-upload";
import type { CloudinaryAsset } from "@/components/cloudinary/cloudinary-image-preview";
import { CLOUDINARY_FOLDERS } from "@/lib/cloudinary/client-folders";
import * as React from "react";

export function AdminCategoryForm({
  category,
}: {
  category?: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    icon: string | null;
    position: number;
    imageUrl?: string | null;
    imagePublicId?: string | null;
    imageWidth?: number | null;
    imageHeight?: number | null;
    imageFormat?: string | null;
  };
}) {
  const action = category ? updateCategoryAction : createCategoryAction;
  const [image, setImage] = React.useState<CloudinaryAsset | null>(
    category?.imageUrl
      ? {
          publicId: category.imagePublicId ?? category.imageUrl,
          secureUrl: category.imageUrl,
          width: category.imageWidth ?? 800,
          height: category.imageHeight ?? 500,
          format: category.imageFormat ?? "",
        }
      : null,
  );
  return (
    <form action={action} className="space-y-6">
      {category ? <input type="hidden" name="id" value={category.id} /> : null}
      <input type="hidden" name="imageUrl" value={image?.secureUrl ?? ""} />
      <input type="hidden" name="imagePublicId" value={image?.publicId ?? ""} />
      <input type="hidden" name="imageWidth" value={image?.width ?? ""} />
      <input type="hidden" name="imageHeight" value={image?.height ?? ""} />
      <input type="hidden" name="imageFormat" value={image?.format ?? ""} />
      <div className="grid gap-5 rounded-xl border bg-card p-5 sm:grid-cols-2">
        <Field
          name="name"
          label="Name"
          required
          defaultValue={category?.name}
        />
        <Field
          name="slug"
          label="Slug"
          required
          defaultValue={category?.slug}
        />
        <Field
          name="icon"
          label="Icon name"
          defaultValue={category?.icon ?? "Blocks"}
        />
        <Field
          name="position"
          label="Position"
          type="number"
          defaultValue={category?.position ?? 0}
        />
        <div className="sm:col-span-2">
          <p className="mb-2 text-sm font-medium">Category image</p>
          <CloudinaryImageUpload
            value={image}
            onChange={setImage}
            folder={CLOUDINARY_FOLDERS.categories}
          />
        </div>
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            defaultValue={category?.description ?? ""}
            rows={4}
          />
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          nativeButton={false}
          render={<Link href="/admin/categories" />}
        >
          Cancel
        </Button>
        <Button type="submit">
          {category ? "Save changes" : "Create category"}
        </Button>
      </div>
    </form>
  );
}
function Field({
  name,
  label,
  required,
  defaultValue,
  type = "text",
}: {
  name: string;
  label: string;
  required?: boolean;
  defaultValue?: string | number;
  type?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        name={name}
        required={required}
        defaultValue={defaultValue}
        type={type}
      />
    </div>
  );
}
