import { path } from 'd3';

import type { Constraint } from '@/features/visual-querying/constraints.types';
import type { Origin } from '@/features/visual-querying/Origin';

export interface RingDims {
  startAngle: number;
  endAngle: number;
  innerRadius: number;
  outerRadius: number;
}

export function getRingSegmentPath(origin: Origin, dims: RingDims) {
  const startAngle = (dims.startAngle * Math.PI) / 180;
  const endAngle = (dims.endAngle * Math.PI) / 180;
  const p = path();

  p.moveTo(
    origin.x(Math.cos(startAngle) * dims.innerRadius),
    origin.y(Math.sin(startAngle) * dims.innerRadius),
  );
  p.arc(origin.x(0), origin.y(0), dims.innerRadius, startAngle, endAngle, false);
  p.lineTo(
    origin.x(Math.cos(endAngle) * dims.outerRadius),
    origin.y(Math.sin(endAngle) * dims.outerRadius),
  );
  p.arc(origin.x(0), origin.y(0), dims.outerRadius, endAngle, startAngle, true);
  p.closePath();

  return p;
}

export function getArcedTextPath(origin: Origin, dims: RingDims, position: string) {
  let startAngle = (dims.startAngle * Math.PI) / 180;
  let endAngle = (dims.endAngle * Math.PI) / 180;
  let radius = dims.innerRadius + (dims.outerRadius - dims.innerRadius) / 2 - 8;
  const counterClockwise = dims.endAngle <= 180;

  const p = path();

  if (counterClockwise) {
    const tmp = startAngle;
    startAngle = endAngle;
    endAngle = tmp;
    radius += 10;
  }

  switch (position) {
    case 'center':
      break;
    case 'top':
      radius = radius + 16;
      break;
    case 'bottom':
      radius = radius - 8;
      break;
    default:
      break;
  }

  p.moveTo(origin.x(Math.cos(startAngle) * radius), origin.y(Math.sin(startAngle) * radius));
  p.arc(origin.x(0), origin.y(0), radius, startAngle, endAngle, counterClockwise);

  return p;
}

export function getRingSegmentColors(
  id: Constraint['id'] | Constraint['kind']['id'],
): [string, string] {
  switch (id) {
    case 'date-range':
      return ['#29C24B', '#0A5C1C'];
    case 'label':
      return ['#EB436B', '#6F001A'];
    // case 'geometry':
    //   return ['#5184E7', '#0C2E72'];
    case 'vocabulary':
      return ['#E9E131', '#565307'];
    // case 'date-lived-constraint':
    //   return ['#1E7D33', '#65FA86'];
    case 'person-birth-date':
      return ['#1EC543', '#205F2E'];
    case 'person-death-date':
      return ['#5EE97D', '#006717'];
    // case 'place-lived-constraint':
    //   return ['#1E4A7D', '#70B2FF'];
    // case 'person-birth-place':
    //   return ['#1E89C5', '#0E4462'];
    // case 'person-death-place':
    //   return ['#5ED0E9', '#005A6D'];
    case 'person-name':
      return ['#DC2450', '#FFD0DB'];
    case 'person-occupation':
      return ['#D8D027', '#FFFDCF'];
    default:
      return ['lightneutral', 'darkneutral'];
  }
}
