import type { Locale } from "~/config/i18n.config";
import { defaultLocale } from "~/config/i18n.config";

export function createLocalePathname(
	pathname: string | undefined,
	locale?: Locale,
): string | undefined {
	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
	if (locale == null || locale === defaultLocale) return pathname;
	if (pathname == null) return locale;
	if (pathname.startsWith("/")) return ["/", locale, pathname].join("");
	return [locale, pathname].join("/");
}
