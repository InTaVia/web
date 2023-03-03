import { useSearchEntitiesQuery } from "@/api/intavia.service";
import { useSearchEntitiesFilters } from "@/components/search/use-search-entities-filters";

export function useSearchEntitiesResults() {
	const searchEntitiesFilters = useSearchEntitiesFilters();
	const query = useSearchEntitiesQuery(searchEntitiesFilters);

	return query;
}
