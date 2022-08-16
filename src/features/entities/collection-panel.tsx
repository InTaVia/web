import CollectionPanelEntry from '@/features/entities/collection-panel-entry';
import { usePersonsSearchResults } from '@/features/entities/use-persons-search-results';

interface CollectionPanelProps {
  draggable?: boolean;
  mini?: boolean;
}

export function CollectionPanel(props: CollectionPanelProps): JSX.Element {
  const searchResults = usePersonsSearchResults();

  const { draggable = false, mini = false } = props;

  return (
    <div className="grid grid-flow-row">
      {searchResults.data?.entities.map((d) => {
        return <CollectionPanelEntry key={d.id} entity={d} draggable={draggable} mini={mini} />;
      })}
    </div>
  );
}
