import { ChevronDownIcon, ChevronRightIcon, ChevronUpIcon } from '@heroicons/react/solid';
import { Fragment } from 'react';

import Popover from '@/features/ui/Popover';

export interface LayoutOptionData {
  key: string;
  symbol: string;
  title: string;
  description?: string;
}
const layoutOptions: Array<LayoutOptionData> = [
  {
    key: 'single-pane',
    symbol: 'M0 0H1V1H0z',
    title: 'Single Pane',
    description: 'Show only one pane, in full size.',
  },
  {
    key: 'two-rows',
    symbol: 'M0 0H1V0.5H0z M0 0.5H1V1H0z',
    title: 'Two Rows',
    description: 'Two panes, stacked on top of each other.',
  },
  {
    key: 'two-cols',
    symbol: 'M0 0H1V1H0zM0.5 0V1',
    title: 'Two Columns',
    description: 'Two panes, placed next to each other.',
  },
  {
    key: 'three-rows',
    symbol: 'M0 0H1V1H0zM0 0.33H1M0 0.67H1',
    title: 'Three Rows',
    description: 'Three panes, stacked on top of each other.',
  },
  {
    key: 'three-cols',
    symbol: 'M0 0H1V1H0zM0.33 0V1M0.67 0V1',
    title: 'Three Columns',
    description: 'Three panes, placed next to each other.',
  },
  {
    key: 'two-rows-one-right',
    symbol: 'M0 0H1V1H0zM0 0.5H0.5M0.5 0V1',
    title: 'Two rows, one right',
    description: 'Three panes, two rows left, one large right.',
  },
  {
    key: 'two-rows-one-left',
    symbol: 'M0 0H1V1H0zM0.5 0.5H1M0.5 0V1',
    title: 'Two rows, one left',
    description: 'Three panes, two rows right, one large left.',
  },
  {
    key: 'grid-2x2',
    symbol: 'M0 0H1V1H0zM0 0.5H1M0.5 0V1',
    title: '2x2 grid',
    description: 'Four panes in a 2x2 grid.',
  },
];

export interface LayoutButtonProps {
  onLayoutSelected: (layoutKey: LayoutOptionData['key']) => void;
}

export default function LayoutButton(props: LayoutButtonProps): JSX.Element {
  return (
    <Popover buttonClassName="flex gap-1 items-center" panelClassName="z-50" noOverlay={true}>
      {({ open, placement }) => {
        return (
          <Fragment>
            Layouts
            {open ? (
              placement === 'bottom' ? (
                <ChevronDownIcon className="h-5 w-5" />
              ) : (
                <ChevronUpIcon className="h-5 w-5" />
              )
            ) : (
              <ChevronRightIcon className="h-5 w-5" />
            )}
          </Fragment>
        );
      }}

      {({ close }) => {
        return (
          <Fragment>
            <div className="max-h-54 z-50 grid grid-cols-2 gap-4 overflow-y-auto rounded-md bg-white p-4 text-gray-800 drop-shadow-2xl">
              {layoutOptions.map((option) => {
                return (
                  <button
                    key={option.key}
                    className="grid grid-cols-[3.6rem_1fr] grid-rows-[1.2rem_2.4rem] gap-1 rounded bg-white p-1 hover:bg-slate-100 active:bg-slate-300"
                    onClick={() => {
                      props.onLayoutSelected(option.key);
                      close();
                    }}
                  >
                    <svg className="col-1 row-span-full" viewBox="-0.3 -0.3 1.6 1.6">
                      <path
                        d={option.symbol}
                        strokeWidth={0.02}
                        shapeRendering="crispEdges"
                        fill="none"
                        stroke="currentColor"
                      />
                    </svg>
                    <span className="col-2 row-1 text-left font-semibold">{option.title}</span>
                    <p className="col-2 row-1 text-left font-light">{option.description ?? ''}</p>
                  </button>
                );
              })}
            </div>
          </Fragment>
        );
      }}
    </Popover>
  );
}
