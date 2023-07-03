import type { Entity } from '@intavia/api-client';

import { IntaviaIcon } from '@/features/common/icons/intavia-icon';

interface EntityTitleProps {
  label: Entity['label'];
  kind: Entity['kind'];
}

export function EntityTitle(props: EntityTitleProps): JSX.Element {
  const { label, kind } = props;

  return (
    <h1 className="flex items-center gap-2 text-4xl font-extrabold">
      <IntaviaIcon icon={kind} className="h-8 w-8 fill-none stroke-slate-800" strokeWidth={1.5} />
      <span>{label.default}</span>
    </h1>
  );
}
