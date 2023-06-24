import type { ComponentPropsWithoutRef, ElementRef } from 'react';
import { forwardRef } from 'react';

export const PersonSvgGroup = forwardRef<ElementRef<'g'>, ComponentPropsWithoutRef<'g'>>(
  function PersonSvgGroup(props, forwardedRef): JSX.Element {
    const { className, ...rest } = props;
    return (
      <g ref={forwardedRef} className={className} {...rest}>
        <circle cx="12" cy="8" r="5" />
        <path d="M 3 21 L 3 18 A 8 4 0 1 1 21 18 L 21 21 z" />
      </g>
    );
  },
);

export const CulturalHeritageObjectSvgGroup = forwardRef<
  ElementRef<'g'>,
  ComponentPropsWithoutRef<'g'>
>(function CulturalHeritageObjectSvgGroup(props, forwardedRef): JSX.Element {
  const { className, ...rest } = props;
  return (
    <g ref={forwardedRef} className={className} {...rest}>
      <rect width="18" height="18" x="3" y="3" rx="0" ry="0" />
    </g>
  );
});

export const GroupSvgGroup = forwardRef<ElementRef<'g'>, ComponentPropsWithoutRef<'g'>>(
  function GroupSvgGroup(props, forwardedRef): JSX.Element {
    const { className, ...rest } = props;
    return (
      <g ref={forwardedRef} className={className} {...rest}>
        <path d="M 3 8 12 3 21 8 V 21 H 3 z"></path>
      </g>
    );
  },
);

export const PlaceSvgGroup = forwardRef<ElementRef<'g'>, ComponentPropsWithoutRef<'g'>>(
  function PlaceSvgGroup(props, forwardedRef): JSX.Element {
    const { className, ...rest } = props;
    return (
      <g ref={forwardedRef} className={className} {...rest}>
        <path d="M 2 3 22 3 12 21 z" />
      </g>
    );
  },
);

export const EventCircleSvgGroup = forwardRef<ElementRef<'g'>, ComponentPropsWithoutRef<'g'>>(
  function EventCircleSvgGroup(props, forwardedRef): JSX.Element {
    const { className, ...rest } = props;
    return (
      <g ref={forwardedRef} className={className} {...rest}>
        <circle cx="12" cy="12" r="9" />
      </g>
    );
  },
);

export const EventRectSvgGroup = forwardRef<ElementRef<'g'>, ComponentPropsWithoutRef<'g'>>(
  function EventRectSvgGroup(props, forwardedRef): JSX.Element {
    const { className, ...rest } = props;
    return (
      <g ref={forwardedRef} className={className} {...rest}>
        <rect width="18" height="18" x="3" y="3" rx="0" ry="0" />
      </g>
    );
  },
);

export const TimelineSvgGroup = forwardRef<ElementRef<'g'>, ComponentPropsWithoutRef<'g'>>(
  function TimelineSvgGroup(props, forwardedRef): JSX.Element {
    const { className, ...rest } = props;
    return (
      <g ref={forwardedRef} className={className} {...rest}>
        <circle cx="5" cy="12" r="2" />
        <circle cx="12" cy="12" r="2" />
        <circle cx="19" cy="12" r="2" />
        <polyline points="7,12 10,12"></polyline>
        <polyline points="14,12 17,12"></polyline>
      </g>
    );
  },
);

export const MapSvgGroup = forwardRef<ElementRef<'g'>, ComponentPropsWithoutRef<'g'>>(
  function MapSvgGroup(props, forwardedRef): JSX.Element {
    const { className, ...rest } = props;
    return (
      <g ref={forwardedRef} className={className} {...rest}>
        <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
        <line x1="9" x2="9" y1="3" y2="18" />
        <line x1="15" x2="15" y1="6" y2="21" />
      </g>
    );
  },
);

export const NetworkSvgGroup = forwardRef<ElementRef<'g'>, ComponentPropsWithoutRef<'g'>>(
  function NetworkSvgGroup(props, forwardedRef): JSX.Element {
    const { className, ...rest } = props;
    return (
      <g ref={forwardedRef} className={className} {...rest}>
        <path d="M6.4,17.6l3.5-3.5" />
        <path d="M17.3,18l-3.4-3.7" />
        <path d="M10.2,9.3L8.8,6.8" />
        <circle cx="19" cy="19" r="2" />
        <circle cx="8" cy="5" r="2" />
        <circle cx="5" cy="19" r="2" />
        <circle cx="12" cy="12" r="3" />
      </g>
    );
  },
);

export const CollectionSvgGroup = forwardRef<ElementRef<'g'>, ComponentPropsWithoutRef<'g'>>(
  function CollectionSvgGroup(props, forwardedRef): JSX.Element {
    const { className, ...rest } = props;
    return (
      <g ref={forwardedRef} className={className} {...rest}>
        <path d="M8.3 10a.7.7 0 0 1-.626-1.079L11.4 3a.7.7 0 0 1 1.198-.043L16.3 8.9a.7.7 0 0 1-.572 1.1Z" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <circle cx="17.5" cy="17.5" r="3.5" />
      </g>
    );
  },
);
