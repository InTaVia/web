export function range(start: number, end: number): Array<number> {
	if (start > end) return [];

	return Array(end - start + 1)
		.fill(null)
		.map((_, i) => {
			return i + start;
		});
}
