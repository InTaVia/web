import type { UrlSearchParamsInit } from "@stefanprobst/request";
import { useMemo } from "react";

import { useLocale } from "@/app/route/use-locale";
import { usePathname } from "@/app/route/use-pathname";
import { createAppUrl } from "@/lib/create-app-url";

export function useCanonicalUrl(searchParams?: UrlSearchParamsInit): URL {
	const pathname = usePathname();
	const { locale } = useLocale();

	const url = useMemo(() => {
		const url = createAppUrl({
			locale,
			pathname,
			searchParams,
			hash: undefined,
		});

		return url;
	}, [locale, pathname, searchParams]);

	return url;
}
