import { Button, Popover, PopoverCloseButton, PopoverContent, PopoverTrigger } from '@intavia/ui';

import type { PanelLayout } from '@/features/ui/analyse-page-toolbar/layout-popover';
import { layoutOptions, storyLayout } from '@/features/ui/analyse-page-toolbar/layout-popover';

export interface SlideLayoutButtonProps {
  onLayoutSelected: (layoutKey: PanelLayout) => void;
}

export default function SlideLayoutButton(props: SlideLayoutButtonProps): JSX.Element {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button>Slide Layout</Button>
      </PopoverTrigger>

      <PopoverContent className="grid w-full">
        <h3 className="text-lg font-semibold text-intavia-gray-800">Set Your Slide Layout</h3>

        <div className="grid grid-cols-2 gap-1 overflow-y-auto rounded-md p-1 text-gray-800 drop-shadow-2xl">
          {storyLayout.map((option) => {
            const layout = layoutOptions[option];

            return (
              <PopoverCloseButton asChild key={option}>
                <button
                  className="grid grid-cols-[3.6rem_1fr] grid-rows-2 rounded bg-white p-1 hover:bg-neutral-100 active:bg-neutral-200"
                  onClick={() => {
                    props.onLayoutSelected(option);
                  }}
                >
                  <svg className="row-span-full" viewBox="-0.3 -0.3 1.6 1.6">
                    {layout.symbol !== undefined && (
                      <path
                        d={layout.symbol}
                        strokeWidth={0.02}
                        shapeRendering="crispEdges"
                        fill="none"
                        stroke="currentColor"
                      />
                    )}

                    {layout.contentSymbol !== undefined && (
                      <path
                        d={layout.contentSymbol}
                        strokeWidth={0.02}
                        shapeRendering="crispEdges"
                        fill="rgb(165, 223, 252)"
                        stroke="currentColor"
                      />
                    )}
                  </svg>

                  <span className="self-end text-left font-semibold">{layout.title}</span>

                  <p className="text-left font-light">{layout.description ?? ''}</p>
                </button>
              </PopoverCloseButton>
            );
          })}
        </div>

        <div className="mt-2 flex">
          <PopoverCloseButton asChild>
            <Button className="ml-auto self-end">Close</Button>
          </PopoverCloseButton>
        </div>
      </PopoverContent>
    </Popover>
  );
}
