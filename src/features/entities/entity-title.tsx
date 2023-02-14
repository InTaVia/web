import type { Entity } from '@intavia/api-client';

import { EntityKindIcon } from '@/features/common/entity-kind-icon';

interface EntityTitleProps {
  label: Entity['label'];
  kind: Entity['kind'];
}

export function EntityTitle(props: EntityTitleProps): JSX.Element {
  const { label, kind } = props;

  return (
    <h1 className="flex items-center gap-2 text-4xl font-extrabold">
      <EntityKindIcon kind={kind} />
      <span>{label.default}</span>
    </h1>
  );
}
