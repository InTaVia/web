import { useRef } from "react";

export function useInitialValue<T>(value: T): T {
	const ref = useRef(value);

	return ref.current;
}
