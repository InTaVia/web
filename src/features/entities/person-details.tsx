import type { Person } from '@intavia/api-client';

import { NetworkComponent } from '@/features/ego-network/network-component';
import { EntityAlternativeLabels } from '@/features/entities/entity-alternative-labels';
import { EntityDescription } from '@/features/entities/entity-description';
import { EntityLinkedIds } from '@/features/entities/entity-linked-ids';
import { EntityRelations } from '@/features/entities/entity-relations';
import { EntityTitle } from '@/features/entities/entity-title';

interface PersonDetailsProps {
  entity: Person;
}

export function PersonDetails(props: PersonDetailsProps): JSX.Element {
  const { entity: person } = props;

  /** Some entities duplicate the default label in the list of alternative labels. */
  const alternativeLabels = person.alternativeLabels?.filter((label) => {
    return label.default !== person.label.default;
  });

  const hasRelations = person.relations != null && person.relations.length > 0;

  return (
    <div className="mx-auto grid w-full max-w-6xl content-start gap-4 px-8 py-12">
      <EntityTitle kind={person.kind} label={person.label} />
      <EntityAlternativeLabels labels={alternativeLabels} />
      <EntityLinkedIds links={person.linkedIds} />
      <EntityDescription description={person.description} />
      <PersonMetadataList gender={person.gender} occupations={person.occupations} />
      {hasRelations ? <EntityRelations relations={person.relations} /> : null}
      {hasRelations ? (
        <NetworkComponent
          visualization={{
            id: `ego-network-${person.id}`,
            type: 'ego-network',
            name: `ego-network-${person.id}`,
            entityIds: [person.id],
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

interface PersonMetadataListProps {
  gender: Person['gender'];
  occupations: Person['occupations'];
}

function PersonMetadataList(props: PersonMetadataListProps): JSX.Element | null {
  const { gender, occupations } = props;

  const hasGender = gender != null;
  const hasOccupations = occupations != null && occupations.length > 0;

  if (!hasGender && !hasOccupations) return null;

  return (
    <dl className="grid gap-4">
      {hasGender ? (
        <div className="grid gap-1">
          <dt className="text-xs font-medium uppercase tracking-wider text-neutral-700">Gender</dt>
          <dd>{gender.label.default}</dd>
        </div>
      ) : null}
      {hasOccupations ? (
        <div className="grid gap-1">
          <dt className="text-xs font-medium uppercase tracking-wider text-neutral-700">
            Occupations
          </dt>
          <dd>
            <ul role="list">
              {occupations.map((occupation) => {
                return (
                  <li key={occupation.id}>
                    <span>{occupation.label.default}</span>
                  </li>
                );
              })}
            </ul>
          </dd>
        </div>
      ) : null}
    </dl>
  );
}
