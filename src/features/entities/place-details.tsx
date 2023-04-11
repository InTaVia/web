import type { Place } from '@intavia/api-client';
import { Marker } from 'react-map-gl';

import { NetworkComponent } from '@/features/ego-network/network-component';
import { EntityAlternativeLabels } from '@/features/entities/entity-alternative-labels';
import { EntityDescription } from '@/features/entities/entity-description';
import { EntityLinkedIds } from '@/features/entities/entity-linked-ids';
import { EntityRelations } from '@/features/entities/entity-relations';
import { EntityTitle } from '@/features/entities/entity-title';
import { GeoMap } from '@/features/geo-map/geo-map';

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

  const hasGeometry =
    place.geometry != null &&
    place.geometry.coordinates != null &&
    place.geometry.coordinates.length === 2;

  return (
    <div className="mx-auto grid w-full max-w-6xl content-start gap-4 px-8 py-12">
      <EntityTitle kind={place.kind} label={place.label} />
      <div className="grid grid-cols-2 gap-16">
        <div className="grid w-full content-start gap-4">
          <EntityAlternativeLabels labels={alternativeLabels} />
          <EntityLinkedIds links={place.linkedIds} />
          <EntityDescription description={place.description} />
          {hasRelations ? <EntityRelations relations={place.relations} /> : null}
          {hasGeometry ? (
            <div className="h-[400px] w-full">
              <GeoMap
                initialViewState={{
                  latitude: place.geometry!.coordinates[1],
                  longitude: place.geometry!.coordinates[0],
                  zoom: 8,
                }}
                mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
              >
                <Marker
                  key={`marker-${place.id}`}
                  longitude={place.geometry!.coordinates[0]}
                  latitude={place.geometry!.coordinates[1]}
                  anchor="bottom"
                ></Marker>
              </GeoMap>
            </div>
          ) : null}
        </div>
        <div className="grid w-full content-start gap-4">
          {hasRelations ? (
            <NetworkComponent
              visualization={{
                id: `ego-network-${place.id}`,
                type: 'ego-network',
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
      </div>
    </div>
  );
}
