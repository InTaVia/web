import type { SearchEntities } from "@intavia/api-client";
import { isEntityKind } from "@intavia/api-client";
import { useMemo } from "react";

import { useSearchParams } from "@/app/route/use-search-params";
import { getSearchParam } from "@/lib/get-search-param";
import { getSearchParams } from "@/lib/get-search-params";
import { toPositiveInteger } from "@/lib/to-positive-integer";
import { defaultPageSize } from "~/config/intavia.config";

export function useSearchEntitiesFilters(): SearchEntities.SearchParams {
	const { searchParams } = useSearchParams();

	const searchEntitiesFilters = useMemo(() => {
		const defaults = {
			page: 1,
			limit: defaultPageSize,
		};

		if (searchParams == null) return defaults;

		const searchEntitiesFilters = {
			page: toPositiveInteger(Number(getSearchParam(searchParams, "page") ?? 1)) ?? defaults.page,
			q: getSearchParam(searchParams, "q"),
			limit: toPositiveInteger(Number(getSearchParam(searchParams, "limit") ?? defaults.limit)),
			kind: getSearchParams(searchParams, "kind").filter(isEntityKind),
			occupation: getSearchParam(searchParams, "occupation"),
			occupations_id: getSearchParams(searchParams, "occupations_id"),
			gender: getSearchParams(searchParams, "gender"),
			gender_id: getSearchParams(searchParams, "gender_id"),
			bornBefore: getSearchParam(searchParams, "bornBefore"),
			bornAfter: getSearchParam(searchParams, "bornAfter"),
			diedBefore: getSearchParam(searchParams, "diedBefore"),
			diedAfter: getSearchParam(searchParams, "diedAfter"),
		};

		return searchEntitiesFilters;
	}, [searchParams]);

	return searchEntitiesFilters;
}
