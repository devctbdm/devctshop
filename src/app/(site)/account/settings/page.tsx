import { AccountSettingsForm } from "@/components/account/account-settings-form";
import { getUserPreferences } from "@/lib/account-settings";
import { requireUser } from "@/lib/auth/session";

export default async function AccountSettingsPage() {
  const user = await requireUser();
  const preferences = await getUserPreferences(user.id);
  return <AccountSettingsForm preferences={preferences} />;
}
