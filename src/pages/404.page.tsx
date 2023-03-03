import { PageMetadata } from "@stefanprobst/next-page-metadata";
import { Fragment } from "react";

import { useI18n } from "@/app/i18n/use-i18n";
import { withDictionaries } from "@/app/i18n/with-dictionaries";
import { usePageTitleTemplate } from "@/app/metadata/use-page-title-template";

export const getStaticProps = withDictionaries(["common"]);

export default function NotFoundErrorPage(): JSX.Element {
	const { t } = useI18n<"common">();
	const titleTemplate = usePageTitleTemplate();

	const metadata = { title: t(["common", "404", "metadata", "title"]) };

	return (
		<Fragment>
			<PageMetadata title={metadata.title} titleTemplate={titleTemplate} />
			<main>
				<h1>{metadata.title}</h1>
			</main>
		</Fragment>
	);
}
