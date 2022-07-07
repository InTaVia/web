import { Popover, Transition } from '@headlessui/react';
import { ChevronRightIcon } from '@heroicons/react/solid';

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
    <Popover className="relative">
      {({ open, close }) => {
        return (
          <>
            <Popover.Button className="flex gap-1 rounded-lg bg-teal-500 p-2 text-white">
              <ChevronRightIcon className={`${open ? 'rotate-90 transform' : ''} h-5 w-5`} />
              <span>Layouts</span>
            </Popover.Button>

            <Transition
              enter="transition duration-100 ease-out"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-75 ease-out"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
            >
              <Popover.Panel className="absolute z-10 mt-4 w-[32rem]">
                <div className="max-h-54 grid grid-cols-2 gap-4 overflow-y-auto rounded-md bg-white p-4 text-gray-800 drop-shadow-2xl">
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
                        <p className="col-2 row-1 text-left font-light">
                          {option.description ?? ''}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </Popover.Panel>
            </Transition>
          </>
        );
      }}
    </Popover>
  );
}
