import type { EntityKind } from '@intavia/api-client';
import { cn } from '@intavia/ui';
import type { ComponentPropsWithoutRef, ElementRef, FC } from 'react';
import { forwardRef } from 'react';

import {
  CollectionSvgGroup,
  CulturalHeritageObjectSvgGroup,
  EventCircleSvgGroup,
  EventRectSvgGroup,
  GroupSvgGroup,
  MapSvgGroup,
  NetworkSvgGroup,
  PersonSvgGroup,
  PlaceSvgGroup,
  TimelineSvgGroup,
} from '@/features/common/icons/intavia-icon-shapes';

type IconTypes = 'collection' | 'event-circle' | 'event-rect' | 'map' | 'network' | 'timeline';
type IntaviaIconTypes = EntityKind | IconTypes;

interface IntaviaIconVariant {
  icon: IntaviaIconTypes;
}

const icons: Record<IntaviaIconTypes, FC<ComponentPropsWithoutRef<'g'>>> = {
  'cultural-heritage-object': CulturalHeritageObjectSvgGroup,
  group: GroupSvgGroup,
  'historical-event': CulturalHeritageObjectSvgGroup, // TODO To be removed
  person: PersonSvgGroup,
  place: PlaceSvgGroup,
  map: MapSvgGroup,
  timeline: TimelineSvgGroup,
  network: NetworkSvgGroup,
  collection: CollectionSvgGroup,
  'event-circle': EventCircleSvgGroup,
  'event-rect': EventRectSvgGroup,
};

type IntaviaIconProps = ComponentPropsWithoutRef<'svg'> & IntaviaIconVariant;
type IntaviaIconElement = ElementRef<'svg'>;

export const IntaviaIcon = forwardRef<IntaviaIconElement, IntaviaIconProps>(function IntaviaIcon(
  props,
  forwardedRef,
): JSX.Element {
  const { className, icon = 'person', ...rest } = props;
  const Icon = icons[icon];
  return (
    <svg
      ref={forwardedRef}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('h-6 w-6', className)}
      {...rest}
    >
      <Icon />
    </svg>
  );
});
