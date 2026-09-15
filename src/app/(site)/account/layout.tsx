import { requireUser } from "@/lib/auth/session";
import { CustomerNav } from "@/components/customer-nav";

export const metadata = {
  title: "Account",
  robots: { index: false, follow: false },
};

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireUser();

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="mb-8">
        <div>
          <h1 className="font-heading text-3xl font-semibold tracking-tight">
            Account
          </h1>
          <p className="mt-2 text-muted-foreground">
            Manage your profile, email verification, and active sessions.
          </p>
        </div>
      </div>
        <CustomerNav active="/account" />
      <main className="mt-8 min-w-0 max-w-3xl">{children}</main>
    </div>
  );
}
