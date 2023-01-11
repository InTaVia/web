import { color as d3color } from 'd3-color';
import { Marker } from 'react-map-gl';

import type { Person } from '@intavia/api-client';

interface StoryMapPinProps {
  id: string;
  lng: number;
  lat: number;
  hovered?: boolean;
  setHovered?: ((entityId: string | null) => void) | null;
  color: string;
}

export function StoryMapPin(props: StoryMapPinProps): JSX.Element {
  const { id, lat, lng, hovered, setHovered, color } = props;

  const size = 16;

  const handleMouseEnter = (entityId: Person['id']) => {
    setHovered && setHovered(entityId);
  };

  const handleMouseLeave = () => {
    setHovered && setHovered(null);
  };

  const colorFill = d3color(color as string)
    ?.brighter(2)
    .formatHex() as string;

  return (
    <Marker key={`${id}`} anchor="center" latitude={lat} longitude={lng}>
      <svg
        height={size}
        viewBox="0 0 24 24"
        style={{ cursor: 'pointer' }}
        onMouseEnter={() => {
          return handleMouseEnter(id);
        }}
        onMouseLeave={handleMouseLeave}
      >
        <circle
          cx={24 / 2}
          cy={24 / 2}
          r={size / 2}
          fill={colorFill}
          stroke={hovered !== undefined && hovered ? 'salmon' : color}
          strokeWidth={hovered !== undefined && hovered ? 4 : 2}
        />
      </svg>
    </Marker>
  );
}

/*
{['beginning', 'end'].includes(marker.eventType) ? (

        ) : (
          <path
            d={`M ${12} ${12 + size / 2} l ${size / 2} ${-size / 2} ${-size / 2} ${-size / 2} ${
              -size / 2
            } ${size / 2} z`}
            fill={colorFill}
            stroke={marker.id.startsWith(hovered as string) ? 'salmon' : color}
            strokeWidth={marker.id.startsWith(hovered as string) ? 4 : 2}
          ></path> */
