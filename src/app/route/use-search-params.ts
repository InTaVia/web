import { useRouter } from "next/router";

import { useRoute } from "@/app/route/use-route";

export type UseSearchParamsResult =
	| {
			searchParams: null;
			isSearchParamsReady: false;
	  }
	| {
			searchParams: URLSearchParams;
			isSearchParamsReady: true;
	  };

export function useSearchParams(): UseSearchParamsResult {
	const router = useRouter();
	const { searchParams } = useRoute();

	if (!router.isReady) {
		return { searchParams: null, isSearchParamsReady: router.isReady };
	}

	return { searchParams, isSearchParamsReady: router.isReady };
}
