import { useEffect, useState } from "react";

import { noop } from "@/lib/noop";
import type { ElementRef } from "@/lib/use-element-ref";
import { useEvent } from "@/lib/use-event";

interface UseResizeObserverParams {
	element: ElementRef<Element> | null;
	onChange?: (entry: ResizeObserverEntry) => void;
}

export function useResizeObserver(params: UseResizeObserverParams): ResizeObserverEntry | null {
	const { element, onChange = noop } = params;

	const [entry, setEntry] = useState<ResizeObserverEntry | null>(null);
	const callback = useEvent(onChange);

	useEffect(() => {
		if (element == null) return;

		const observer = new ResizeObserver((entries) => {
			const [entry] = entries;

			if (!entry) return;

			callback(entry);
			setEntry(entry);
		});

		observer.observe(element);

		return () => {
			observer.unobserve(element);
			observer.disconnect();
		};
	}, [callback, element]);

	return entry;
}
