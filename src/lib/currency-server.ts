import "server-only"

import { getGeneralSettings } from "@/lib/settings"
import { isCurrency } from "@/lib/currency"

export async function getCurrencySettings() {
  const settings = await getGeneralSettings()
  const rate = Number(settings.usdToBdtRate)
  return { defaultCurrency: isCurrency(settings.defaultCurrency) ? settings.defaultCurrency : "USD", supportedCurrencies: settings.supportedCurrencies.filter(isCurrency), usdToBdtRate: Number.isFinite(rate) && rate > 0 ? rate : 120 }
}
