import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductCard } from "@/components/product-card";
import { ProductGallery } from "@/components/product-gallery";
import { PurchaseCard } from "@/components/purchase-card";
import { RatingStars } from "@/components/rating-stars";
import { ReviewsList } from "@/components/reviews-list";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Product } from "@/lib/products";
import { getDatabaseProductBySlug, getRelatedDatabaseProducts } from "@/lib/catalog";
import {
  ArrowLeftIcon,
  CheckIcon,
  CpuIcon,
  FileTextIcon,
  TagIcon,
  InfinityIcon,
} from "lucide-react";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

function Overview({ product }: { product: Product }) {
  return (
    <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
      <p className="text-base text-foreground">{product.tagline}</p>
      <p>{product.description}</p>
      <div>
        <h4 className="mb-2 font-heading text-sm font-semibold text-foreground">
          What&rsquo;s included
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {product.technologies.map((tech) => (
            <Badge key={tech} variant="secondary">
              {tech}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}

function FeaturesList({ product }: { product: Product }) {
  return (
    <ul className="grid gap-2.5 sm:grid-cols-2">
      {product.features.map((feature) => (
        <li key={feature} className="flex items-start gap-2.5 text-sm">
          <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
            <CheckIcon className="size-3" />
          </span>
          <span className="text-muted-foreground">{feature}</span>
        </li>
      ))}
    </ul>
  );
}

function Requirements({ product }: { product: Product }) {
  return (
    <ul className="space-y-2 text-sm">
      {product.requirements.map((req) => (
        <li
          key={req}
          className="flex items-start gap-2.5 text-muted-foreground"
        >
          <span className="mt-1 size-1.5 shrink-0 rounded-full bg-muted-foreground/50" />
          {req}
        </li>
      ))}
    </ul>
  );
}

function License({ product }: { product: Product }) {
  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center gap-2">
          <FileTextIcon className="size-4 text-foreground/70" />
          <span className="font-heading text-sm font-semibold">
            {product.license.label}
          </span>
        </div>
      </div>
      <ul className="space-y-2 text-sm">
        {product.license.includes.map((line) => (
          <li
            key={line}
            className="flex items-start gap-2.5 text-muted-foreground"
          >
            <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              <CheckIcon className="size-3" />
            </span>
            {line}
          </li>
        ))}
      </ul>
    </div>
  );
}

function DetailTabs({ product }: { product: Product }) {
  return (
    <Tabs defaultValue="overview" className="mt-8">
      <div>
        <TabsList className="h-9">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="requirements">Requirements</TabsTrigger>
          <TabsTrigger value="license">License</TabsTrigger>
        </TabsList>
      </div>
      <div className="mt-5">
        <TabsContent value="overview">
          <Overview product={product} />
        </TabsContent>
        <TabsContent value="features">
          <FeaturesList product={product} />
        </TabsContent>
        <TabsContent value="requirements">
          <Requirements product={product} />
        </TabsContent>
        <TabsContent value="license">
          <License product={product} />
        </TabsContent>
      </div>
    </Tabs>
  );
}

function MetaRow({ product }: { product: Product }) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <Card className="gap-1.5 py-3">
        <CardHeader className="gap-0.5">
          <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <TagIcon className="size-3.5" /> Version
          </span>
        </CardHeader>
        <CardContent className="pt-0">
          <span className="font-heading text-sm font-semibold">
            {product.version}
          </span>
        </CardContent>
      </Card>
      <Card className="gap-1.5 py-3">
        <CardHeader className="gap-0.5">
          <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <CpuIcon className="size-3.5" /> Stack
          </span>
        </CardHeader>
        <CardContent className="pt-0">
          <span className="font-heading text-sm font-semibold">
            {product.technologies[0]}
          </span>
        </CardContent>
      </Card>
      <Card className="gap-1.5 py-3">
        <CardHeader className="gap-0.5">
          <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <InfinityIcon className="size-3.5" /> Updates
          </span>
        </CardHeader>
        <CardContent className="pt-0">
          <span className="font-heading text-sm font-semibold">Lifelong</span>
        </CardContent>
      </Card>
    </div>
  );
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getDatabaseProductBySlug(slug);
  if (!product) return { title: "Product not found — Devct Shop" };
  return {
    title: `${product.name} — Devct Shop`,
    description: product.tagline,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      title: product.name,
      description: product.tagline,
      type: "website",
      url: `/products/${product.slug}`,
      siteName: "Devct Shop",
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getDatabaseProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedDatabaseProducts(product, 4);
  const reviews = product.reviews;

  return (
    <div className="bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <Button
          variant="ghost"
          size="sm"
          nativeButton={false}
          render={<Link href="/products" />}
          className="-ml-2 mb-4 gap-1.5 text-muted-foreground"
        >
          <ArrowLeftIcon className="size-4" />
          Back to products
        </Button>

        <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
          <div>
            <ProductGallery slug={product.slug} frames={product.gallery} />

            <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
              <div>
                <Link
                  href={`/categories/${product.categorySlug}`}
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  {product.category}
                </Link>
                <h1 className="mt-1 font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
                  {product.name}
                </h1>
                <div className="mt-2 flex items-center gap-2 text-sm">
                  <RatingStars rating={product.rating} />
                  <span className="font-medium">
                    {product.rating.toFixed(1)}
                  </span>
                  <span className="text-muted-foreground">
                    · {reviews} reviews
                  </span>
                </div>
              </div>
              {product.badge ? (
                <Badge
                  variant={product.badge === "New" ? "default" : "secondary"}
                >
                  {product.badge}
                </Badge>
              ) : null}
            </div>

            <DetailTabs product={product} />
            <div className="mt-6">
              <MetaRow product={product} />
            </div>
          </div>

          <div className="lg:sticky lg:top-20">
            <PurchaseCard product={product} />
          </div>
        </div>
      </div>

      <section className="border-t bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
          <h2 className="font-heading text-xl font-semibold tracking-tight sm:text-2xl">
            {reviews} reviews
          </h2>
          <div className="mt-6">
            <ReviewsList product={product} />
          </div>
        </div>
      </section>

      {related.length > 0 ? (
        <section className="border-t">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
            <h2 className="font-heading text-xl font-semibold tracking-tight sm:text-2xl">
              Related products
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((item) => (
                <ProductCard key={item.slug} product={item} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
