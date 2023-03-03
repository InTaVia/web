import { SearchForm } from "@/components/search/search-form";
import { SearchResultsStatistics } from "@/components/search/search-results-statistics";

export function SearchPanel(): JSX.Element {
	return (
		<div>
			<SearchForm />
			<SearchResultsStatistics />
		</div>
	);
}
