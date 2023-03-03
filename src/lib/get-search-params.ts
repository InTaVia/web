export function getSearchParams(searchParams: URLSearchParams, key: string): Array<string> {
	const values = searchParams
		.getAll(key)
		.map((value) => {
			return value.trim();
		})
		.filter((value) => {
			return value.length !== 0;
		});
	return values;
}
