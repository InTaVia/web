import type { Group } from '@intavia/api-client';

import { NetworkComponent } from '@/features/ego-network/network-component';
import { EntityAlternativeLabels } from '@/features/entities/entity-alternative-labels';
import { EntityLinkedIds } from '@/features/entities/entity-linked-ids';
import { EntityRelations } from '@/features/entities/entity-relations';
import { EntityTitle } from '@/features/entities/entity-title';

interface GroupDetailsProps {
  entity: Group;
}

export function GroupDetails(props: GroupDetailsProps): JSX.Element {
  const { entity: group } = props;

  /** Some entities duplicate the default label in the list of alternative labels. */
  const alternativeLabels = group.alternativeLabels?.filter((label) => {
    return label.default !== group.label.default;
  });

  const hasRelations = group.relations != null && group.relations.length > 0;

  return (
    <div className="mx-auto grid w-full max-w-6xl content-start gap-4 px-8 py-12">
      <EntityTitle kind={group.kind} label={group.label} />
      <EntityAlternativeLabels labels={alternativeLabels} />
      <EntityLinkedIds links={group.linkedIds} />
      {hasRelations ? <EntityRelations relations={group.relations} /> : null}
      {hasRelations ? (
        <NetworkComponent
          visualization={{
            id: `ego-network-${group.id}`,
            type: 'ego-network',
            name: `ego-network-${group.id}`,
            entityIds: [group.id],
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
