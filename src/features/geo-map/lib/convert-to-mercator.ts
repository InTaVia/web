/*
 * from: https://github.com/maplibre/maplibre-gl-js/blob/main/src/geo/lng_lat.ts
 * Approximate radius of the earth in meters.
 * Uses the WGS-84 approximation. The radius at the equator is ~6378137 and at the poles is ~6356752. https://en.wikipedia.org/wiki/World_Geodetic_System#WGS84
 * 6371008.8 is one published "average radius" see https://en.wikipedia.org/wiki/Earth_radius#Mean_radius, or ftp://athena.fsv.cvut.cz/ZFG/grs80-Moritz.pdf p.4
 */
export const earthRadius = 6371008.8;

/**
 * from: https://github.com/Turfjs/turf/blob/master/packages/turf-projection/index.ts
 * Convert lon/lat values to 900913 x/y.
 * (from https://github.com/mapbox/sphericalmercator)
 *
 * @private
 * @param {Array<number>} lonLat WGS84 point
 * @returns {Array<number>} Mercator [x, y] point
 */
export function convertToMercator(lonLat: Array<number>) {
  if (lonLat.length < 2 || lonLat[0] == null || lonLat[1] == null) return;
  const D2R = Math.PI / 180;
  const MAXEXTENT = 20037508.342789244;

  // compensate longitudes passing the 180th meridian
  // from https://github.com/proj4js/proj4js/blob/master/lib/common/adjust_lon.js
  const adjusted = Math.abs(lonLat[0]) <= 180 ? lonLat[0] : lonLat[0] - sign(lonLat[0]) * 360;
  const xy = [
    earthRadius * adjusted * D2R,
    earthRadius * Math.log(Math.tan(Math.PI * 0.25 + 0.5 * lonLat[1] * D2R)),
  ];

  // if xy value is beyond maxextent (e.g. poles), return maxextent
  if (xy[0] == null || xy[1] == null) return;
  if (xy[0] > MAXEXTENT) xy[0] = MAXEXTENT;
  if (xy[0] < -MAXEXTENT) xy[0] = -MAXEXTENT;
  if (xy[1] > MAXEXTENT) xy[1] = MAXEXTENT;
  if (xy[1] < -MAXEXTENT) xy[1] = -MAXEXTENT;

  return xy;
}

/**
 * from: https://github.com/Turfjs/turf/blob/master/packages/turf-projection/index.ts
 * Returns the sign of the input, or zero
 *
 * @private
 * @param {number} x input
 * @returns {number} -1|0|1 output
 */
function sign(x: number) {
  return x < 0 ? -1 : x > 0 ? 1 : 0;
}
