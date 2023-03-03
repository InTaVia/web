import { useRouter } from "next/router";
import { useMemo } from "react";

import { createAppUrl } from "@/lib/create-app-url";

export function useRoute(): URL {
	const router = useRouter();

	const url = useMemo(() => {
		return createAppUrl({ pathname: router.asPath });
	}, [router]);

	return url;
}
