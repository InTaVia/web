import type { ComponentPropsWithoutRef, ElementRef } from 'react';
import { forwardRef } from 'react';

export const PersonSvgGroup = forwardRef<ElementRef<'g'>, ComponentPropsWithoutRef<'g'>>(
  function PersonSvgGroup(props, forwardedRef): JSX.Element {
    const { className, ...rest } = props;
    return (
      <g ref={forwardedRef} className={className} {...rest}>
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2z" />
        <circle cx="12" cy="7" r="4" />
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
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
    </g>
  );
});

export const GroupSvgGroup = forwardRef<ElementRef<'g'>, ComponentPropsWithoutRef<'g'>>(
  function GroupSvgGroup(props, forwardedRef): JSX.Element {
    const { className, ...rest } = props;
    return (
      <g ref={forwardedRef} className={className} {...rest}>
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
      </g>
    );
  },
);

export const HistoricalEventSvgGroup = forwardRef<ElementRef<'g'>, ComponentPropsWithoutRef<'g'>>(
  function HistoricalEventSvgGroup(props, forwardedRef): JSX.Element {
    const { className, ...rest } = props;
    return (
      <g ref={forwardedRef} className={className} {...rest}>
        <path d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
      </g>
    );
  },
);

export const PlaceSvgGroup = forwardRef<ElementRef<'g'>, ComponentPropsWithoutRef<'g'>>(
  function PlaceSvgGroup(props, forwardedRef): JSX.Element {
    const { className, ...rest } = props;
    return (
      <g ref={forwardedRef} className={className} {...rest}>
        <path
          className="st0"
          d="M2.2,6l8,14c0.5,1,1.8,1.3,2.7,0.8c0.3-0.2,0.6-0.4,0.8-0.8l8-14C22.3,5,22,3.8,21,3.3C20.7,3.1,20.3,3,20,3H4
	C2.9,3,2,3.9,2,5C2,5.3,2.1,5.7,2.2,6z"
        />
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
        {/* <path d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" /> */}
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
        <circle className="st0" cx="12" cy="12" r="3" />
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
