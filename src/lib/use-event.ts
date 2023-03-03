import { useCallback, useRef } from "react";

import { useIsomorphicLayoutEffect as useLayoutEffect } from "@/lib/use-isomorphic-layout-effect";

type Fn<TParams extends Array<unknown>, TResult> = (...params: TParams) => TResult;

/**
 * TODO: Should be replaced with upstream `useEvent` once that lands in `react`.
 *
 * @see https://github.com/reactjs/rfcs/blob/useevent/text/0000-useevent.md
 */
export function useEvent<TParams extends Array<unknown>, TResult>(
	handler: Fn<TParams, TResult>,
): Fn<TParams, TResult> {
	const handlerRef = useRef(handler);

	useLayoutEffect(() => {
		handlerRef.current = handler;
	});

	return useCallback((...params: TParams): TResult => {
		return handlerRef.current(...params);
	}, []);
}
