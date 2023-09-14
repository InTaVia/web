import { Tooltip } from '@/features/common/tooltip/tooltip';

export function TooltipProvider(): JSX.Element {
  return (
    <div
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        left: 0,
        top: 0,
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
