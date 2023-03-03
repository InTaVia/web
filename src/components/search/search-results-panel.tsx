import { CollectionProvider } from "@/components/search/collection.context";
import { CollectionToolbar } from "@/components/search/collection-toolbar";
import { CollectionView } from "@/components/search/collection-view";
import { SearchResultsToolbar } from "@/components/search/search-results-toolbar";
import { SearchResultsView } from "@/components/search/search-results-view";

export function SearchResultsPanel(): JSX.Element {
	return (
		<div className="grid h-full min-h-0 grid-cols-2 grid-rows-[auto_1fr] divide-x divide-neutral-200 overflow-hidden">
			<CollectionProvider>
				<SearchResultsToolbar />
				<CollectionToolbar />
				<SearchResultsView />
				<CollectionView />
			</CollectionProvider>
		</div>
	);
}
