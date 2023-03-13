import { Tooltip } from '@/features/common/tooltip/tooltip';

export function TooltipProvider(): JSX.Element {
  return (
    <div
      id="tooltipProvider"
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        left: 0,
        top: 0,
        overflow: 'hidden',
        visibility: 'hidden',
      }}
    >
      <div
        id="tooltipProvider"
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        <Tooltip />
      </div>
    </div>
  );
}
