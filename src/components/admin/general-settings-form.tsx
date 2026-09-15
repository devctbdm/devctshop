"use client"

import * as React from "react"
import { updateGeneralSettingsAction } from "@/lib/settings-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FormAlert } from "@/components/auth/fields"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { LoaderIcon, SaveIcon } from "lucide-react"

type Settings = { shopName: string; tagline: string; siteDescription: string; contactEmail: string | null; contactPhone: string | null; address: string | null; footerDescription: string; copyrightText: string; facebookUrl: string | null; githubUrl: string | null; youtubeUrl: string | null; linkedinUrl: string | null; defaultCurrency: string; supportedCurrencies: string[]; usdToBdtRate: string | number }

export function GeneralSettingsForm({ settings }: { settings: Settings }) {
  const [pending, setPending] = React.useState(false)
  const [message, setMessage] = React.useState<"success" | "error" | null>(null)
  const [values, setValues] = React.useState(() => ({
    shopName: settings.shopName,
    tagline: settings.tagline,
    siteDescription: settings.siteDescription,
    contactEmail: settings.contactEmail ?? "",
    contactPhone: settings.contactPhone ?? "",
    address: settings.address ?? "",
    footerDescription: settings.footerDescription,
    copyrightText: settings.copyrightText,
    facebookUrl: settings.facebookUrl ?? "",
    githubUrl: settings.githubUrl ?? "",
    youtubeUrl: settings.youtubeUrl ?? "",
    linkedinUrl: settings.linkedinUrl ?? "",
    defaultCurrency: settings.defaultCurrency,
    supportedCurrencies: settings.supportedCurrencies,
    usdToBdtRate: String(settings.usdToBdtRate),
  }))

  function update(name: keyof typeof values, value: string) {
    setValues((current) => ({ ...current, [name]: value }))
  }

  async function submit(formData: FormData) {
    setPending(true)
    setMessage(null)
    try {
      await updateGeneralSettingsAction(formData)
      setMessage("success")
    } catch {
      setMessage("error")
    } finally {
      setPending(false)
    }
  }

  return <form action={submit} className="space-y-6">{message === "success" ? <FormAlert variant="success">General settings saved successfully.</FormAlert> : null}{message === "error" ? <FormAlert variant="error">Could not save settings. Check the fields and try again.</FormAlert> : null}<Card><CardHeader><CardTitle>Website information</CardTitle><CardDescription>Define the identity and description used across the public marketplace.</CardDescription></CardHeader><CardContent className="grid gap-4 sm:grid-cols-2"><Field name="shopName" label="Shop name" required value={values.shopName} onChange={(value) => update("shopName", value)} /><Field name="tagline" label="Tagline" required value={values.tagline} onChange={(value) => update("tagline", value)} /><TextAreaField name="siteDescription" label="Site description" required value={values.siteDescription} onChange={(value) => update("siteDescription", value)} className="sm:col-span-2" /></CardContent></Card><Card><CardHeader><CardTitle>Contact information</CardTitle><CardDescription>Contact details displayed in the public footer.</CardDescription></CardHeader><CardContent className="grid gap-4 sm:grid-cols-2"><Field name="contactEmail" label="Contact email" type="email" value={values.contactEmail} onChange={(value) => update("contactEmail", value)} /><Field name="contactPhone" label="Contact phone" value={values.contactPhone} onChange={(value) => update("contactPhone", value)} /><TextAreaField name="address" label="Address" value={values.address} onChange={(value) => update("address", value)} className="sm:col-span-2" /></CardContent></Card><Card><CardHeader><CardTitle>Footer</CardTitle><CardDescription>Customize the footer copy and copyright line.</CardDescription></CardHeader><CardContent className="grid gap-4"><TextAreaField name="footerDescription" label="Footer description" required value={values.footerDescription} onChange={(value) => update("footerDescription", value)} /><Field name="copyrightText" label="Copyright text" required value={values.copyrightText} onChange={(value) => update("copyrightText", value)} /></CardContent></Card><Card><CardHeader><CardTitle>Currency settings</CardTitle><CardDescription>Set the default storefront currency and USD to BDT conversion rate.</CardDescription></CardHeader><CardContent className="grid gap-4 sm:grid-cols-2"><div className="flex flex-col gap-1.5"><Label htmlFor="defaultCurrency">Default currency</Label><select id="defaultCurrency" name="defaultCurrency" value={values.defaultCurrency} onChange={(event) => update("defaultCurrency", event.target.value)} className="h-8 rounded-lg border border-input bg-background px-2.5 text-sm"><option value="USD">USD — US Dollar ($)</option><option value="BDT">BDT — Bangladeshi Taka (৳)</option></select></div><Field name="usdToBdtRate" label="1 USD = BDT" type="number" required value={values.usdToBdtRate} onChange={(value) => update("usdToBdtRate", value)} /><input type="hidden" name="supportedCurrencies" value={values.supportedCurrencies.join(",")} /><p className="text-xs text-muted-foreground sm:col-span-2">This rate applies to new product displays and checkout calculations. Existing orders keep their original snapshot.</p></CardContent></Card><Card><CardHeader><CardTitle>Social links</CardTitle><CardDescription>Optional links. Empty fields stay hidden on the public site.</CardDescription></CardHeader><CardContent className="grid gap-4 sm:grid-cols-2"><Field name="facebookUrl" label="Facebook URL" type="url" value={values.facebookUrl} onChange={(value) => update("facebookUrl", value)} /><Field name="githubUrl" label="GitHub URL" type="url" value={values.githubUrl} onChange={(value) => update("githubUrl", value)} /><Field name="youtubeUrl" label="YouTube URL" type="url" value={values.youtubeUrl} onChange={(value) => update("youtubeUrl", value)} /><Field name="linkedinUrl" label="LinkedIn URL" type="url" value={values.linkedinUrl} onChange={(value) => update("linkedinUrl", value)} /></CardContent></Card><Separator /><div className="flex justify-end"><Button type="submit" size="lg" disabled={pending}>{pending ? <LoaderIcon className="size-4 animate-spin" /> : <SaveIcon className="size-4" />}{pending ? "Saving…" : "Save changes"}</Button></div></form>
}

function Field({ name, label, type = "text", required, value, onChange }: { name: string; label: string; type?: string; required?: boolean; value: string; onChange: (value: string) => void }) { return <div className="flex flex-col gap-1.5"><Label htmlFor={name}>{label}</Label><Input id={name} name={name} type={type} required={required} value={value} onChange={(event) => onChange(event.target.value)} /></div> }
function TextAreaField({ name, label, required, value, onChange, className }: { name: string; label: string; required?: boolean; value: string; onChange: (value: string) => void; className?: string }) { return <div className={`flex flex-col gap-1.5 ${className ?? ""}`}><Label htmlFor={name}>{label}</Label><Textarea id={name} name={name} required={required} value={value} onChange={(event) => onChange(event.target.value)} rows={4} /></div> }
