import { ChevronDownIcon, ChevronRightIcon, ChevronUpIcon } from '@heroicons/react/solid';
import { Fragment } from 'react';

import Popover from '@/features/ui/Popover';

export interface LayoutOptionData {
  key: string;
  symbol?: string;
  title: string;
  description?: string;
}

export const visLayout = [
  'single-vis',
  'two-cols',
  'two-rows',
  'three-cols',
  'three-rows',
  'two-rows-one-left',
  'two-rows-one-right',
  'grid-2x2',
] as const;

type VisLayout = typeof visLayout[number];

export interface VisOptionData extends LayoutOptionData {
  key: VisLayout;
}

export const storyLayout = [
  //'title',
  'single-vis',
  'single-vis-content',
  'single-content',
  'two-contents',
] as const;

export type StoryLayout = typeof storyLayout[number];
export type PanelLayout = StoryLayout | VisLayout;

export interface StoryVisOptionData extends LayoutOptionData {
  key: StoryLayout;
  contentSymbol?: string;
}

export const layoutOptions: Record<PanelLayout, LayoutOptionData> = {
  'single-vis': {
    key: 'single-vis',
    symbol: 'M0 0H1V1H0z',
    title: 'Single Vis',
    description: 'Show only one vis, in full size.',
  },
  'single-content': {
    key: 'single-content',
    symbol: '',
    contentSymbol: 'M0 0H1V1H0z',
    title: 'Single Content',
    description: 'Show only one content, in full size.',
  } as StoryVisOptionData,
  title: {
    key: 'title',
    symbol: 'M0 0H1V1H0z M0.2 0.5 L0.8 0.5',
    title: 'Title Slide',
    description: 'Show title slide.',
  },
  'two-rows': {
    key: 'two-rows',
    symbol: 'M0 0H1V0.5H0z M0 0.5H1V1H0z',
    title: 'Two Rows',
    description: 'Two vis, stacked on top of each other.',
  },
  'two-cols': {
    key: 'two-cols',
    symbol: 'M0 0H1V1H0zM0.5 0V1',
    title: 'Two Columns',
    description: 'Two vis, placed next to each other.',
  },
  'three-rows': {
    key: 'three-rows',
    symbol: 'M0 0H1V1H0zM0 0.33H1M0 0.67H1',
    title: 'Three Rows',
    description: 'Three vis, stacked on top of each other.',
  },
  'three-cols': {
    key: 'three-cols',
    symbol: 'M0 0H1V1H0zM0.33 0V1M0.67 0V1',
    title: 'Three Columns',
    description: 'Three vis, placed next to each other.',
  },
  'two-rows-one-right': {
    key: 'two-rows-one-right',
    symbol: 'M0 0H1V1H0zM0 0.5H0.5M0.5 0V1',
    title: 'Two rows, one right',
    description: 'Three vis, two rows left, one large right.',
  },
  'two-rows-one-left': {
    key: 'two-rows-one-left',
    symbol: 'M0 0H1V1H0zM0.5 0.5H1M0.5 0V1',
    title: 'Two rows, one left',
    description: 'Three vis, two rows right, one large left.',
  },
  'grid-2x2': {
    key: 'grid-2x2',
    symbol: 'M0 0H1V1H0zM0 0.5H1M0.5 0V1',
    title: '2x2 grid',
    description: 'Four visualizations in a 2x2 grid.',
  },
  'single-vis-content': {
    key: 'single-vis-content',
    symbol: 'M0 0H.67V1H0z',
    contentSymbol: 'M.67 0H1V1H.67Z',
    title: 'Vis + Content',
    description: 'Two visualizations, placed next to each other.',
  } as StoryVisOptionData,
  /* 'two-cols-content': {
    key: 'two-cols-content',
    symbol: 'M0 0H.67V1H0zM.33 0V1M.67 0V1Z',
    contentSymbol: 'M.67 0H1V1H.67Z',
    title: 'Three Columns',
    description: 'Two vis left, one content pane right.',
  } as StoryVisOptionData,
  'two-rows-content': {
    key: 'two-rows-content',
    symbol: 'M0 0H.67V1H0zM0 .5H.67M.67 0V1Z',
    contentSymbol: 'M.67 0H1V1H.67Z',
    title: 'Two Vis + Content',
    description: 'Two vis left, one content pane right.',
  } as StoryVisOptionData, */
  'two-contents': {
    key: 'two-contents',
    contentSymbol: 'M0 0H1V1H0zM0.5 0V1',
    title: 'Two Contents',
    description: 'Two content panes, placed next to each other.',
  } as StoryVisOptionData,
};

export interface LayoutButtonProps {
  onLayoutSelected: (layoutKey: VisOptionData['key']) => void;
}

export default function LayoutButton(props: LayoutButtonProps): JSX.Element {
  return (
    <Popover
      buttonClassName="flex gap-1 items-center"
      panelClassName="z-50"
      noOverlay={true}
      color="accent"
      size="small"
      round="pill"
    >
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
              {visLayout.map((option: VisLayout) => {
                const layout = layoutOptions[option] as LayoutOptionData;
                return (
                  <button
                    key={option}
                    className="grid grid-cols-[3.6rem_1fr] grid-rows-[1.2rem_2.4rem] gap-1 rounded bg-white p-1 hover:bg-slate-100 active:bg-slate-300"
                    onClick={() => {
                      props.onLayoutSelected(option);
                      close();
                    }}
                  >
                    <svg className="col-1 row-span-full" viewBox="-0.3 -0.3 1.6 1.6">
                      <path
                        d={layout.symbol}
                        strokeWidth={0.02}
                        shapeRendering="crispEdges"
                        fill="none"
                        stroke="currentColor"
                      />
                    </svg>
                    <span className="col-2 row-1 text-left font-semibold">{layout.title}</span>
                    <p className="col-2 row-1 text-left font-light">{layout.description ?? ''}</p>
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
