import Link from "next/link";
import { ArrowRightIcon, PackageOpenIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export function CustomerEmpty({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: { label: string; href: string };
}) {
  return (
    <div className="flex min-h-56 flex-col items-center justify-center rounded-xl border border-dashed bg-muted/20 px-6 text-center">
      <span className="flex size-11 items-center justify-center rounded-xl bg-muted text-muted-foreground">
        <PackageOpenIcon className="size-5" />
      </span>
      <h2 className="mt-4 font-heading text-lg font-semibold">{title}</h2>
      <p className="mt-1 max-w-md text-sm text-muted-foreground">
        {description}
      </p>
      {action ? (
        <Button
          nativeButton={false}
          className="mt-4"
          size="sm"
          render={<Link href={action.href} />}
        >
          {action.label}
          <ArrowRightIcon className="size-4" />
        </Button>
      ) : null}
    </div>
  );
}
