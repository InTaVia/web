import type { CulturalHeritageObject } from '@intavia/api-client';

import { EgoNetworkComponent } from '@/features/ego-network/ego-network-component';
import { EntityAlternativeLabels } from '@/features/entities/entity-alternative-labels';
import { EntityLinkedIds } from '@/features/entities/entity-linked-ids';
import { EntityRelations } from '@/features/entities/entity-relations';
import { EntityTitle } from '@/features/entities/entity-title';

interface CulturalHeritageObjectDetailsProps {
  entity: CulturalHeritageObject;
}

export function CulturalHeritageObjectDetails(
  props: CulturalHeritageObjectDetailsProps,
): JSX.Element {
  const { entity: cho } = props;

  /** Some entities duplicate the default label in the list of alternative labels. */
  const alternativeLabels = cho.alternativeLabels?.filter((label) => {
    return label.default !== cho.label.default;
  });

  const hasRelations = cho.relations != null && cho.relations.length > 0;

  return (
    <div className="mx-auto grid w-full max-w-6xl content-start gap-4 px-8 py-12">
      <EntityTitle kind={cho.kind} label={cho.label} />
      <EntityAlternativeLabels labels={alternativeLabels} />
      <EntityLinkedIds links={cho.linkedIds} />
      {hasRelations ? <EntityRelations relations={cho.relations} /> : null}
      {hasRelations ? <EgoNetworkComponent entity={cho} width={600} height={600} /> : null}
    </div>
  );
}