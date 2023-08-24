import type { ForwardedRef, ReactNode } from 'react';
import { forwardRef } from 'react';

import type { VisualizationDimensions } from '@/features/visualizations/use-visualization-dimensions';

interface VisualizationRootProps {
  children: ReactNode;
  dimensions: VisualizationDimensions;
}

export const VisualizationRoot = forwardRef(function VisualisationRoot(
  props: VisualizationRootProps,
  ref: ForwardedRef<HTMLDivElement>,
): JSX.Element {
  const { children, dimensions } = props;

  return (
    <div ref={ref} className="relative h-full w-full">
      <svg className="absolute inset-0" height={dimensions.height} width={dimensions.width}>
        <g transform={`translate(${dimensions.marginLeft}, ${dimensions.marginTop})`}>{children}</g>
      </svg>
    </div>
  );
});
