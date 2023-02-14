import {
  DocumentIcon,
  LibraryIcon,
  LightningBoltIcon,
  LocationMarkerIcon,
  UserIcon,
} from '@heroicons/react/outline';
import type { EntityKind } from '@intavia/api-client';
import type { FC, SVGProps } from 'react';

import { useI18n } from '@/app/i18n/use-i18n';

interface EntityKindIconProps {
  kind: EntityKind;
}

const icons: Record<EntityKind, FC<SVGProps<SVGSVGElement>>> = {
  'cultural-heritage-object': DocumentIcon,
  group: LibraryIcon,
  'historical-event': LightningBoltIcon,
  person: UserIcon,
  place: LocationMarkerIcon,
};

export function EntityKindIcon(props: EntityKindIconProps): JSX.Element | null {
  const { kind } = props;

  const { t } = useI18n<'common'>();

  const Icon = icons[kind];
  // TODO: heroicons needs to enable svgr `titleProp` option
  // const title = t(['common', 'entity', 'kinds', kind]);

  return <Icon className="h-6 w-6 flex-shrink-0" width="1em" />;
}
