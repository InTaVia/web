import { useAppSelector } from '@/app/store';
import { selectLocalEntities } from '@/features/common/entities.slice';
import type { Person } from '@/features/common/entity.model';
import CollectionPanelEntry from '@/features/entities/collection-panel-entry';
import { usePersonsSearchResults } from '@/features/entities/use-persons-search-results';
// import { usePersonsSearchResults } from '@/features/entities/use-persons-search-results';

interface CollectionPanelProps {
  draggable?: boolean;
  mini?: boolean;
}

export function CollectionPanel(props: CollectionPanelProps): JSX.Element {
  const searchResults = usePersonsSearchResults();
  const localEntities = useAppSelector(selectLocalEntities);

  const { draggable = false, mini = false } = props;

  return (
    <div className="grid grid-flow-row">
      {Object.values(localEntities).map((d: Person) => {
        return <CollectionPanelEntry key={d.id} entity={d} draggable={draggable} mini={mini} />;
      })}
      {/*  {searchResults.data?.entities.map((d) => {
        return <CollectionPanelEntry key={d.id} entity={d} draggable={draggable} mini={mini} />;
      })} */}
    </div>
  );
}
