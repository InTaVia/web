import type { HistoricalEvent } from '@intavia/api-client';

import { EgoNetworkComponent } from '@/features/ego-network/ego-network-component';
import { EntityAlternativeLabels } from '@/features/entities/entity-alternative-labels';
import { EntityLinkedIds } from '@/features/entities/entity-linked-ids';
import { EntityRelations } from '@/features/entities/entity-relations';
import { EntityTitle } from '@/features/entities/entity-title';

interface HistoricalEventDetailsProps {
  entity: HistoricalEvent;
}

export function HistoricalEventDetails(props: HistoricalEventDetailsProps): JSX.Element {
  const { entity: historicalEvent } = props;

  /** Some entities duplicate the default label in the list of alternative labels. */
  const alternativeLabels = historicalEvent.alternativeLabels?.filter((label) => {
    return label.default !== historicalEvent.label.default;
  });

  const hasRelations = historicalEvent.relations != null && historicalEvent.relations.length > 0;

  return (
    <div className="mx-auto grid w-full max-w-6xl content-start gap-4 px-8 py-12">
      <EntityTitle kind={historicalEvent.kind} label={historicalEvent.label} />
      <EntityAlternativeLabels labels={alternativeLabels} />
      <EntityLinkedIds links={historicalEvent.linkedIds} />
      {hasRelations ? <EntityRelations relations={historicalEvent.relations} /> : null}
      {hasRelations ? (
        <EgoNetworkComponent
          visualization={{
            id: `ego-network-${historicalEvent.id}`,
            type: 'ego-network',
            name: `ego-network-${historicalEvent.id}`,
            entityIds: [historicalEvent.id],
            targetEntityIds: [],
            eventIds: [],
          }}
          width={600}
          height={600}
        />
      ) : null}
    </div>
  );
}
