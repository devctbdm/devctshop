import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { AdminHeader } from "@/components/admin/admin-header";
import { ConfirmAction } from "@/components/admin/confirm-action";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAdminCategories } from "@/lib/admin";
import {
  deleteCategoryAction,
  toggleCategoryAction,
} from "@/lib/admin-actions";

export default async function AdminCategoriesPage() {
  const rows = await getAdminCategories();
  return (
    <div className="mx-auto max-w-7xl">
      <AdminHeader
        title="Categories"
        description="Organize and publish product categories."
      />
      <div className="mb-5 flex justify-end">
        <Button
          nativeButton={false}
          render={<Link href="/admin/categories/new" />}
        >
          <PlusIcon className="size-4" />
          Add category
        </Button>
      </div>
      <div className="rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Products</TableHead>
              <TableHead>State</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {category.slug}
                </TableCell>
                <TableCell>—</TableCell>
                <TableCell>
                  <form action={toggleCategoryAction}>
                    <input type="hidden" name="id" value={category.id} />
                    <input
                      type="hidden"
                      name="value"
                      value={String(!category.isActive)}
                    />
                    <Button
                      size="sm"
                      variant={category.isActive ? "secondary" : "outline"}
                      type="submit"
                    >
                      {category.isActive ? "Published" : "Hidden"}
                    </Button>
                  </form>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      nativeButton={false}
                      render={
                        <Link href={`/admin/categories/${category.id}`} />
                      }
                    >
                      Edit
                    </Button>
                    <ConfirmAction
                      label="Delete"
                      title={`Delete ${category.name}?`}
                      description="Products using this category must be moved before deletion."
                      action={
                        <form action={deleteCategoryAction}>
                          <input type="hidden" name="id" value={category.id} />
                          <Button type="submit" variant="destructive">
                            Delete category
                          </Button>
                        </form>
                      }
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {!rows.length ? (
          <p className="p-10 text-center text-sm text-muted-foreground">
            No categories found.
          </p>
        ) : null}
      </div>
    </div>
  );
}
