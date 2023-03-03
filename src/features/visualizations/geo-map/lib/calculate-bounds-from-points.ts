export function calculateBoundsFromPoints(
	points: Array<[number, number]>,
): [number, number, number, number] {
	const lng: Array<number> = [];
	const lat: Array<number> = [];

	points.forEach((point) => {
		lng.push(point[0]);
		lat.push(point[1]);
	});

	const corners = [Math.min(...lng), Math.min(...lat), Math.max(...lng), Math.max(...lat)];

	return corners as [number, number, number, number];
}
