import type { ElementRef } from '@/lib/use-element-ref';
import { useEvent } from '@/lib/use-event';
import { useResizeObserver } from '@/lib/use-resize-observer';

interface UseElementDimensionsParams {
  element: ElementRef<Element> | null;
  onChange?: (rect: DOMRectReadOnly) => void;
}

export function useElementDimensions(params: UseElementDimensionsParams): DOMRectReadOnly | null {
  const { element, onChange } = params;

  const onChangeDimensions = useEvent((entry: ResizeObserverEntry) => {
    onChange?.(entry.contentRect);
  });

  const rect = useResizeObserver({ element, onChange: onChangeDimensions });

  return rect?.contentRect ?? element?.getBoundingClientRect() ?? null;
}
