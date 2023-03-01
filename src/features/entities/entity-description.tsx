import type { Entity } from '@intavia/api-client';

interface EntityDescriptionProps {
  description: Entity['description'];
}

export function EntityDescription(props: EntityDescriptionProps): JSX.Element {
  const { description } = props;

  return <div>{description}</div>;
}
