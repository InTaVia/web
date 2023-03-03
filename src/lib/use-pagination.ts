import type { PaginationItem } from "@stefanprobst/pagination";
import { createPagination } from "@stefanprobst/pagination";
import { useMemo } from "react";

interface UsePaginationParams {
	page: number | undefined;
	pages: number | undefined;
}

export function usePagination(params: UsePaginationParams): Array<PaginationItem> {
	const { page, pages } = params;

	const pagination = useMemo(() => {
		if (page == null || pages == null) return [];

		return createPagination({ page, pages });
	}, [page, pages]);

	return pagination;
}
