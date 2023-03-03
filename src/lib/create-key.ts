export function createKey(...args: Array<string>): string {
	return args.join("+");
}
