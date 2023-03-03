import { useSearchOccupationStatisticsQuery } from "@/api/intavia.service";
import { useSearchEntitiesFilters } from "@/components/search/use-search-entities-filters";
import type { PersonOccupationConstraint } from "@/features/visual-querying/constraints.types";
import { VocabularyConstraintWidget } from "@/features/visual-querying/VocabularyConstraintWidget";

interface ProfessionConstraintWidgetProps {
	width: number;
	height: number;
	constraint: PersonOccupationConstraint;
}

export function ProfessionConstraintWidget(props: ProfessionConstraintWidgetProps): JSX.Element {
	const { width, height, constraint } = props;

	// TODO:mfranke93: This is currently not considering the filters from other
	// constraints, but that *COULD* be considered a feature, not a bug.
	const searchFilters = useSearchEntitiesFilters();
	const { data, isLoading } = useSearchOccupationStatisticsQuery(searchFilters);

	return (
		<div style={{ width: width, height: height }}>
			<VocabularyConstraintWidget constraint={constraint} data={data?.tree} isLoading={isLoading} />
		</div>
	);
}
