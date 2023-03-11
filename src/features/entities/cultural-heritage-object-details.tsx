import type { CulturalHeritageObject } from '@intavia/api-client';

import { NetworkComponent } from '@/features/ego-network/network-component';
import { EntityAlternativeLabels } from '@/features/entities/entity-alternative-labels';
import { EntityDescription } from '@/features/entities/entity-description';
import { EntityLinkedIds } from '@/features/entities/entity-linked-ids';
import { EntityRelations } from '@/features/entities/entity-relations';
import { EntityTitle } from '@/features/entities/entity-title';
import { MediaViewer } from '@/features/media/media-viewer';

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

  const hasMedia = cho.media != null && cho.media.length > 0;

  return (
    <div className="mx-auto grid w-full max-w-6xl content-start gap-4 px-8 py-12">
      <EntityTitle kind={cho.kind} label={cho.label} />
      <div className="grid grid-cols-2 gap-4">
        <div className="grid w-full content-start gap-4">
          <EntityAlternativeLabels labels={alternativeLabels} />
          <EntityLinkedIds links={cho.linkedIds} />
          <EntityDescription description={cho.description} />
          {hasRelations ? <EntityRelations relations={cho.relations} /> : null}
          {hasMedia ? <MediaViewer mediaResourceIds={cho.media!} /> : null}
        </div>
        <div className="grid w-full content-start gap-4">
          {hasRelations ? (
            <NetworkComponent
              visualization={{
                id: `ego-network-${cho.id}`,
                type: 'ego-network',
                name: `ego-network-${cho.id}`,
                entityIds: [cho.id],
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
