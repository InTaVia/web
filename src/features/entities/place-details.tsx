import type { Place } from "@intavia/api-client";

import { NetworkComponent } from "@/features/ego-network/network-component";
import { EntityAlternativeLabels } from "@/features/entities/entity-alternative-labels";
import { EntityDescription } from "@/features/entities/entity-description";
import { EntityLinkedIds } from "@/features/entities/entity-linked-ids";
import { EntityRelations } from "@/features/entities/entity-relations";
import { EntityTitle } from "@/features/entities/entity-title";

interface PlaceDetailsProps {
	entity: Place;
}

export function PlaceDetails(props: PlaceDetailsProps): JSX.Element {
	const { entity: place } = props;

	/** Some entities duplicate the default label in the list of alternative labels. */
	const alternativeLabels = place.alternativeLabels?.filter((label) => {
		return label.default !== place.label.default;
	});

	const hasRelations = place.relations != null && place.relations.length > 0;

	return (
		<div className="mx-auto grid w-full max-w-6xl content-start gap-4 px-8 py-12">
			<EntityTitle kind={place.kind} label={place.label} />
			<EntityAlternativeLabels labels={alternativeLabels} />
			<EntityLinkedIds links={place.linkedIds} />
			<EntityDescription description={place.description} />
			{hasRelations ? <EntityRelations relations={place.relations} /> : null}
			{hasRelations ? (
				<NetworkComponent
					visualization={{
						id: `ego-network-${place.id}`,
						type: "ego-network",
						name: `ego-network-${place.id}`,
						entityIds: [place.id],
						targetEntityIds: [],
						eventIds: [],
					}}
					width={600}
					height={600}
				/>
			) : null}
		</div>
	);
}
