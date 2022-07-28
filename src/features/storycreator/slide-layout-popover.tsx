import type { SlideLayout } from '@/features/storycreator/story-center-pane';
import Button from '@/features/ui/Button';
import Popover from '@/features/ui/Popover';

interface LayoutOptionData {
  key: string;
  symbol?: string;
  title: string;
  description?: string;
  contentSymbol?: string;
  layout: SlideLayout;
}

const SlideLayouts: Record<string, SlideLayout> = {
  singlevis: {
    numberOfVis: 1,
    numberOfContentPanes: 0,
    vertical: false,
  },
  twovisvertical: {
    numberOfVis: 2,
    numberOfContentPanes: 0,
    vertical: true,
  },
  twovishorizontal: {
    numberOfVis: 2,
    numberOfContentPanes: 0,
    vertical: false,
  },
  singleviscontent: {
    numberOfVis: 1,
    numberOfContentPanes: 1,
    vertical: false,
  },
  twoviscontenthorizontal: {
    numberOfVis: 2,
    numberOfContentPanes: 1,
    vertical: false,
  },
  twoviscontentvertical: {
    numberOfVis: 2,
    numberOfContentPanes: 1,
    vertical: true,
  },
  twocontents: {
    numberOfVis: 0,
    numberOfContentPanes: 2,
    vertical: true,
  },
};

const layoutOptions: Array<LayoutOptionData> = [
  {
    key: 'singlevis',
    symbol: 'M0 0H1V1H0z',
    title: 'Single Vis',
    description: 'Show only one visualization, in full size.',
    layout: SlideLayouts.singlevis as SlideLayout,
  },
  {
    key: 'singleviscontent',
    symbol: 'M0 0H.67V1H0z',
    contentSymbol: 'M.67 0H1V1H.67Z',
    title: 'Vis + Content',
    description: 'Two visualizations, placed next to each other.',
    layout: SlideLayouts.twovisvertical as SlideLayout,
  },
  {
    key: 'twovishorizontal',
    symbol: 'M0 0H1V0.5H0z M0 0.5H1V1H0z',
    title: 'Two Vis',
    description: 'Two vis, stacked on top of each other.',
    layout: SlideLayouts.twovishorizontal as SlideLayout,
  },
  {
    key: 'twovisvertical',
    symbol: 'M0 0H1V1H0zM0.5 0V1',
    title: 'Two Columns',
    description: 'Two visualizations, placed next to each other.',
    layout: SlideLayouts.twovisvertical as SlideLayout,
  },

  {
    key: 'twoviscontentvertical',
    symbol: 'M0 0H.67V1H0zM.33 0V1M.67 0V1Z',
    contentSymbol: 'M.67 0H1V1H.67Z',
    title: 'Three Columns',
    description: 'Two vis left, one content pane right.',
    layout: SlideLayouts.twoviscontentvertical as SlideLayout,
  },
  {
    key: 'twoviscontenthorizontal',
    symbol: 'M0 0H.67V1H0zM0 .5H.67M.67 0V1Z',
    contentSymbol: 'M.67 0H1V1H.67Z',
    title: 'Two Vis + Content',
    description: 'Two vis left, one content pane right.',
    layout: SlideLayouts.twoviscontenthorizontal as SlideLayout,
  },
  {
    key: 'twocontents',
    contentSymbol: 'M0 0H1V1H0zM0.5 0V1',
    title: 'Two Contents',
    description: 'Two content panes, placed next to each other.',
    layout: SlideLayouts.twovisvertical as SlideLayout,
  },
];

export interface SlideLayoutButtonProps {
  onLayoutSelected: (layoutKey: LayoutOptionData['key']) => void;
}

export default function SlideLayoutButton(props: SlideLayoutButtonProps): JSX.Element {
  return (
    <Popover color="accent" size="small" round="pill">
      Slide Layout
      {({ close }) => {
        return (
          <div className="w-90">
            <h3 className="text-lg font-semibold text-intavia-gray-800">Set Your Slide Layout</h3>
            <div className="max-h-54 grid grid-cols-2 gap-1 overflow-y-auto rounded-md p-1 text-gray-800 drop-shadow-2xl">
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
                      {option.symbol !== undefined && (
                        <path
                          d={option.symbol}
                          strokeWidth={0.02}
                          shapeRendering="crispEdges"
                          fill="none"
                          stroke="currentColor"
                        />
                      )}
                      {option.contentSymbol !== undefined && (
                        <path
                          d={option.contentSymbol}
                          strokeWidth={0.02}
                          shapeRendering="crispEdges"
                          fill="rgb(165, 223, 252)"
                          stroke="currentColor"
                        />
                      )}
                    </svg>
                    <span className="col-2 row-1 text-left font-semibold">{option.title}</span>
                    <p className="col-2 row-1 text-left font-light">{option.description ?? ''}</p>
                  </button>
                );
              })}
            </div>

            <div className="mt-2 flex">
              <Button
                size="small"
                color="warning"
                round="round"
                onClick={() => {
                  return close();
                }}
                className="ml-auto self-end"
              >
                Close
              </Button>
            </div>
          </div>
        );
      }}
    </Popover>
  );
}
