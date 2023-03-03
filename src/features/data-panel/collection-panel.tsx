import { useState } from "react";

import { useAppSelector } from "@/app/store";
import type { Collection } from "@/app/store/intavia-collections.slice";
import { selectCollectionsCount } from "@/app/store/intavia-collections.slice";
import { useDataFromCollection } from "@/features/common/data/use-data-from-collection";
import { CollectionSelect } from "@/features/data-panel/collection-select";
import { DataView } from "@/features/data-panel/data-view";

export function CollectionPanel(): JSX.Element {
	const [selectedCollection, setSelectedCollection] = useState<Collection["id"]>("");

	const collectionsCount = useAppSelector(selectCollectionsCount);

	const onCollectionChange = (collection: Collection["id"]) => {
		setSelectedCollection(collection);
	};

	const { entities, events } = useDataFromCollection({ collectionId: selectedCollection });

	if (collectionsCount === 0) {
		return <p>Please create a collection first.</p>;
	}

	return (
		<div className="flex h-full flex-col gap-1 overflow-hidden">
			<CollectionSelect onChange={onCollectionChange} />
			<DataView entities={entities} events={events} />

			{/* <div className="h-full overflow-auto">
        {entities.map((entity) => {
          return (
            <p key={entity.id}>
              {entity.kind} : {entity.label.default}
            </p>
          );
        })}
        {events.map((event) => {
          return (
            <p key={event.id}>
              {event.kind} : {event.label.default}
            </p>
          );
        })}
      </div> */}
			{/* <VisualizationSelect /> */}
			{/* {selectedCollection != null && (
        <div className="flow flow-row">
          Add collection to:
          <select>
            <option>all</option>
            <option>vis 1</option>
            <option>vis 2</option>
            <option>vis 3</option>
          </select>
          <Button size="small" round="pill">
            +
          </Button>
        </div>
      )} */}
		</div>
	);
}
