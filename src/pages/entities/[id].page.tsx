import { PageMetadata } from "@stefanprobst/next-page-metadata";
import { Fragment } from "react";

import { HoverProvider } from "@/app/context/hover.context";
import { useI18n } from "@/app/i18n/use-i18n";
import { withDictionaries } from "@/app/i18n/with-dictionaries";
import { usePageTitleTemplate } from "@/app/metadata/use-page-title-template";
import { useParams } from "@/app/route/use-params";
import { EntityScreen } from "@/features/entities/entity-screen";

/**
 * NOTE: we are intentionally *not* fetching entity details server-side, because we do not know
 * whether the entity id refers to an entity which lives in the upstream knowledge graph, or if the
 * entity was created via local data import, and thus only lives in browser storage. o_O
 */

export const getServerSideProps = withDictionaries(["common"]);

export default function EntityPage(): JSX.Element {
	const { t } = useI18n<"common">();
	const titleTemplate = usePageTitleTemplate();
	const params = useParams();
	const id = params?.get("id");

	const metadata = { title: t(["common", "entity", "metadata", "title"]) };

	return (
		<HoverProvider>
			<Fragment>
				<PageMetadata title={metadata.title} titleTemplate={titleTemplate} />
				{id != null ? <EntityScreen id={id} /> : null}
			</Fragment>
		</HoverProvider>
	);
}
