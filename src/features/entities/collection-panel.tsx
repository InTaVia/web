import CollectionPanelEntry from '@/features/entities/collection-panel-entry';
import { usePersonsSearchResults } from '@/features/entities/use-persons-search-results';

export function CollectionPanel(): JSX.Element {
  const searchResults = usePersonsSearchResults();

  return (
    <div className="grid grid-flow-row">
      {searchResults.data?.entities.map((d) => {
        return <CollectionPanelEntry key={d.id} entity={d} />;
      })}
    </div>
  );
}
