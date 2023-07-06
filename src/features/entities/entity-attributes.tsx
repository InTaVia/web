import type { Entity, Person } from '@intavia/api-client';

import { EntityAlternativeLabels } from '@/features/entities/entity-alternative-labels';
import { EntityDescription } from '@/features/entities/entity-description';
import { EntityLinkedIds } from '@/features/entities/entity-linked-ids';

interface EntityAttributesProps {
  entity: Entity;
}

export function EntityAttributes(props: EntityAttributesProps): JSX.Element {
  const { entity } = props;

  const alternativeLabels = entity.alternativeLabels?.filter((label) => {
    return label.default !== entity.label.default;
  });

  return (
    <dl className="grid w-full content-start gap-4">
      <EntityDescription description={entity.description} />
      <EntityAlternativeLabels labels={alternativeLabels} />
      <EntityLinkedIds links={entity.linkedIds} />
      {entity.kind === 'person' && <PersonMetadataList person={entity as Person} />}
    </dl>
  );
}

// Person
interface PersonMetadataListProps {
  person: Person;
}

function PersonMetadataList(props: PersonMetadataListProps): JSX.Element | null {
  const { person } = props;

  const hasGender = person.gender != null;
  const hasOccupations = person.occupations != null && person.occupations.length > 0;

  if (!hasGender && !hasOccupations) return null;

  return (
    <>
      {hasGender ? (
        <div className="grid gap-1">
          <dt className="font-bold uppercase text-neutral-700">Gender</dt>
          <dd>{person.gender!.label.default}</dd>
        </div>
      ) : null}
      {hasOccupations ? (
        <div className="grid gap-1">
          <dt className="font-bold uppercase text-neutral-700">Occupations</dt>
          <dd>
            <ul role="list">
              {person.occupations!.map((occupation) => {
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
    </>
  );
}
