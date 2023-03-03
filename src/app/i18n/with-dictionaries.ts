import type { GetServerSideProps, GetStaticProps, PreviewData } from "next";
import type { ParsedUrlQuery } from "querystring";

import type { Dictionaries } from "@/app/i18n/dictionaries";
import { loadDictionaries } from "@/app/i18n/load-dictionaries";
import type { Locale } from "~/config/i18n.config";

export function withDictionaries<P, Q extends ParsedUrlQuery, D extends PreviewData>(
	keys: Array<keyof Dictionaries>,
	fn?: GetServerSideProps<P, Q, D> | GetStaticProps<P, Q, D>,
) {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return async function getProps(context: any) {
		const locale = context.locale as Locale;
		const dictionaries = await loadDictionaries(locale, keys);

		if (fn == null) {
			return { props: { dictionaries } };
		}

		const result = await fn(context);

		if ("props" in result) {
			return { ...result, props: { ...result.props, dictionaries } };
		}

		return result;
	};
}
