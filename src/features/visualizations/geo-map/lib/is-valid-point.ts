import type { Geometry, Point } from 'geojson'

export function isValidPoint(geometry: Geometry): geometry is Point {
  if (geometry.type !== 'Point') return false

  // longitude must be in valid bounds
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  if (geometry.coordinates[0]! >= -180 && geometry.coordinates[0]! <= 180) {
    return true
  }

  // latitude must be in valid bounds
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  if (geometry.coordinates[1]! >= -90 && geometry.coordinates[1]! <= 90) {
    return true
  }

  return false
}
