import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminProductForm } from "@/components/admin/admin-product-form";
import { getAdminProduct } from "@/lib/admin";
import { Button } from "@/components/ui/button";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getAdminProduct(id);
  if (!product) notFound();
  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-3">
        <Button
          variant="ghost"
          size="sm"
          nativeButton={false}
          render={<Link href="/admin/products" />}
        >
          Back to products
        </Button>
      </div>
      <AdminHeader
        title={`Edit ${product.name}`}
        description="Update product content, pricing, and publication state."
      />
      <AdminProductForm product={product} />
    </div>
  );
}
