import type { RefObject } from 'react';
import { useCallback, useLayoutEffect, useState } from 'react';

// TODO: remove
export function useResizeObserverDeprecated(
  ref: RefObject<HTMLElement>,
  callback?: (entry: DOMRectReadOnly) => void,
): [number, number] {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const handleResize = useCallback(
    (entries: Array<ResizeObserverEntry>) => {
      if (!Array.isArray(entries)) {
        return;
      }

      const entry = entries[0];
      if (!entry) {
        return;
      }

      setWidth(entry.contentRect.width);
      setHeight(entry.contentRect.height);

      if (callback) {
        callback(entry.contentRect);
      }
    },
    [callback],
  );

  useLayoutEffect(() => {
    if (!ref.current) {
      return;
    }

    const RO = new ResizeObserver((entries: Array<ResizeObserverEntry>) => {
      return handleResize(entries);
    });
    RO.observe(ref.current);

    return () => {
      RO.disconnect();
    };
  }, [handleResize, ref]);

  return [width, height];
}
