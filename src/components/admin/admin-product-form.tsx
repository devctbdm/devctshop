import Link from "next/link";
import { createProductAction, updateProductAction } from "@/lib/admin-actions";
import { getAdminCategories } from "@/lib/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ProductGalleryField } from "@/components/admin/product-gallery-field";
import { DigitalFileUpload } from "@/components/admin/digital-file-upload";
import { randomUUID } from "node:crypto";

type ProductRecord = Awaited<
  ReturnType<typeof import("@/lib/admin").getAdminProduct>
>;

export async function AdminProductForm({
  product,
}: {
  product?: NonNullable<ProductRecord>;
}) {
  const categories = await getAdminCategories();
  const action = product ? updateProductAction : createProductAction;
  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="id" value={product?.id ?? randomUUID()} />
      <div className="grid gap-5 rounded-xl border bg-card p-5 sm:grid-cols-2">
        <Field
          name="name"
          label="Product name"
          required
          defaultValue={product?.name}
        />
        <Field
          name="slug"
          label="Slug"
          required
          defaultValue={product?.slug}
          placeholder="my-product"
        />
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="categoryId">Category</Label>
          <select
            id="categoryId"
            name="categoryId"
            required
            defaultValue={product?.categoryId ?? ""}
            className="h-8 rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <Field
          name="version"
          label="Version"
          required
          defaultValue={product?.version ?? "1.0.0"}
        />
        <Field
          name="price"
          label="Price (USD)"
          required
          type="number"
          step="0.01"
          min="0.01"
          defaultValue={product ? product.priceCents / 100 : undefined}
        />
        <Field
          name="salePrice"
          label="Sale price (optional)"
          type="number"
          step="0.01"
          min="0"
          defaultValue={
            product?.salePriceCents ? product.salePriceCents / 100 : undefined
          }
        />
        <div className="flex flex-col gap-1.5"><Label htmlFor="productType">Product type</Label><select id="productType" name="productType" required defaultValue={product?.productType ?? "PAID"} className="h-8 rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"><option value="PAID">Paid</option><option value="FREE">Free</option></select></div>
        <Field
          name="license"
          label="License"
          required
          defaultValue={product?.license ?? "Commercial License"}
        />
        <Field
          name="thumbnailUrl"
          label="Thumbnail URL"
          type="url"
          defaultValue={product?.thumbnailUrl ?? ""}
        />
        <Field
          name="demoUrl"
          label="Demo URL"
          type="url"
          defaultValue={product?.demoUrl ?? ""}
        />
        <TextAreaField
          name="tagline"
          label="Tagline"
          defaultValue={product?.tagline ?? ""}
        />
        <TextAreaField
          name="description"
          label="Description"
          required
          defaultValue={product?.description ?? ""}
          className="sm:col-span-2"
        />
        <ProductGalleryField
          initial={(product?.images ?? []).map((image) => ({
            publicId: image.publicId,
            secureUrl: image.secureUrl,
            width: image.width,
            height: image.height,
            format: image.format,
          }))}
        />
        <DigitalFileUpload productId={product?.id} version={product?.version ?? "1.0.0"} initial={(product?.files ?? []).map((file) => ({ name: file.name, path: file.path, sizeBytes: file.sizeBytes, mimeType: file.mimeType ?? "application/zip" }))} />
        <TextAreaField
          name="images"
          label="Legacy image URLs (optional)"
          defaultValue={(product?.imageUrls ?? []).join("\n")}
        />
        <TextAreaField
          name="technologies"
          label="Technologies (one per line)"
          defaultValue={(product?.techStack ?? []).join("\n")}
        />
        <TextAreaField
          name="features"
          label="Features (one per line)"
          defaultValue={(product?.features ?? []).join("\n")}
        />
        <TextAreaField
          name="requirements"
          label="Requirements (one per line)"
          defaultValue={(product?.requirements ?? []).join("\n")}
        />
        <TextAreaField
          name="tags"
          label="Tags (one per line)"
          defaultValue={(product?.tags ?? []).join("\n")}
        />
      </div>
      <div className="flex items-center justify-end gap-2">
        <Button
          variant="outline"
          nativeButton={false}
          render={<Link href="/admin/products" />}
        >
          Cancel
        </Button>
        <Button type="submit">
          {product ? "Save changes" : "Create product"}
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
  ...props
}: {
  name: string;
  label: string;
  required?: boolean;
  defaultValue?: string | number;
  type?: string;
  [key: string]: unknown;
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
        {...props}
      />
    </div>
  );
}
function TextAreaField({
  name,
  label,
  required,
  defaultValue,
  className,
}: {
  name: string;
  label: string;
  required?: boolean;
  defaultValue?: string;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className ?? ""}`}>
      <Label htmlFor={name}>{label}</Label>
      <Textarea
        id={name}
        name={name}
        required={required}
        defaultValue={defaultValue}
        rows={4}
      />
    </div>
  );
}
