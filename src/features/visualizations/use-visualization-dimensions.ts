import { useElementDimensions } from '@/lib/use-element-dimensions';
import type { ElementRef } from '@/lib/use-element-ref';

interface UseVisualizationDimensionsParams {
  dimensions?: Partial<Omit<VisualizationDimensions, 'boundedHeight' | 'boundedWidth'>>;
  element: ElementRef<Element> | null;
}

export interface VisualizationDimensions {
  boundedHeight: number;
  boundedWidth: number;
  height: number;
  marginBottom: number;
  marginLeft: number;
  marginRight: number;
  marginTop: number;
  width: number;
}

export function useVisualisationDimensions(
  params: UseVisualizationDimensionsParams,
): VisualizationDimensions {
  const { dimensions, element } = params;

  const rect = useElementDimensions({ element });

  const marginBottom = dimensions?.marginBottom ?? 32;
  const marginLeft = dimensions?.marginLeft ?? 32;
  const marginRight = dimensions?.marginRight ?? 32;
  const marginTop = dimensions?.marginTop ?? 32;

  const height = dimensions?.height ?? rect?.height ?? 0;
  const width = dimensions?.width ?? rect?.width ?? 0;

  const boundedHeight = Math.max(height - marginTop - marginBottom, 0);
  const boundedWidth = Math.max(width - marginLeft - marginRight, 0);

  return {
    boundedHeight,
    boundedWidth,
    height,
    marginBottom,
    marginLeft,
    marginRight,
    marginTop,
    width,
  };
}
