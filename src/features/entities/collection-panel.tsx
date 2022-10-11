import { useAppSelector } from '@/app/store';
import { selectLocalEntities } from '@/app/store/entities.slice';
import CollectionPanelEntry from '@/features/entities/collection-panel-entry';
import { useSearchEntitiesResults } from '@/features/entities/use-search-entities-results';

interface CollectionPanelProps {
  draggable?: boolean;
  mini?: boolean;
}

export function CollectionPanel(props: CollectionPanelProps): JSX.Element {
  const searchResults = useSearchEntitiesResults();
  const localEntities = useAppSelector(selectLocalEntities);

  const { draggable = false, mini = false } = props;

  return (
    <div className="grid grid-flow-row">
      {Object.values(localEntities).map((d) => {
        return <CollectionPanelEntry key={d.id} entity={d} draggable={draggable} mini={mini} />;
      })}
      {searchResults.data?.results.map((d) => {
        return <CollectionPanelEntry key={d.id} entity={d} draggable={draggable} mini={mini} />;
      })}
    </div>
  );
}
