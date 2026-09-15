import { AdminHeader } from "@/components/admin/admin-header"
import { GeneralSettingsForm } from "@/components/admin/general-settings-form"
import { getGeneralSettings } from "@/lib/settings"

export default async function AdminSettingsPage() {
  const settings = await getGeneralSettings()
  return <div className="mx-auto max-w-4xl"><AdminHeader title="General settings" description="Manage the public website information shown across Devct Shop." /><GeneralSettingsForm settings={settings} /></div>
}
