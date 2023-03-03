import type { UrlInit } from "@stefanprobst/request";
import { createUrl } from "@stefanprobst/request";

import { createLocalePathname } from "@/lib/create-locale-pathname";
import { baseUrl } from "~/config/app.config";
import type { Locale } from "~/config/i18n.config";

export interface CreateAppUrlArgs extends Omit<UrlInit, "baseUrl"> {
	locale?: Locale;
}

export function createAppUrl(args: CreateAppUrlArgs): URL {
	const pathname = createLocalePathname(args.pathname, args.locale);
	return createUrl({ ...args, baseUrl, pathname });
}
