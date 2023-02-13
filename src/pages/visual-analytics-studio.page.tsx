import { Allotment } from 'allotment';

import { PageContext } from '@/app/context/page.context';
import { withDictionaries } from '@/app/i18n/with-dictionaries';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { DataPanel } from '@/features/data-panel/data-panel';
import type { LayoutOptionData } from '@/features/ui/analyse-page-toolbar/layout-popover';
import AnalysePageToolbar from '@/features/ui/analyse-page-toolbar/toolbar';
import DisclosureWrapper from '@/features/ui/DisclosureWrapper';
import { centerPaneProps, leftPaneProps, rightPaneProps } from '@/features/ui/panes.config';
import { selectPaneOpen } from '@/features/ui/ui.slice';
import Workspaces from '@/features/visualization-layouts/workspaces';
import { setLayoutForCurrentWorkspace } from '@/features/visualization-layouts/workspaces.slice';

export const getStaticProps = withDictionaries(['common']);

export default function AnalysePage(): JSX.Element {
  const dispatch = useAppDispatch();
  const leftPaneOpen = useAppSelector((state) => {
    return selectPaneOpen(state, 'vas', 'left');
  });

  const rightPaneOpen = useAppSelector((state) => {
    return selectPaneOpen(state, 'vas', 'right');
  });

  const onLayoutSelected = (key: LayoutOptionData['key']) => {
    dispatch(setLayoutForCurrentWorkspace(key));
  };

  return (
    <PageContext.Provider value={{ page: 'visual-analytics-studio' }}>
      <Allotment>
        <Allotment.Pane visible={leftPaneOpen} {...leftPaneProps}>
          <DataPanel />
        </Allotment.Pane>
        <Allotment.Pane {...centerPaneProps}>
          <div className="flex h-full w-full flex-col overflow-hidden">
            <AnalysePageToolbar onLayoutSelected={onLayoutSelected} />
            <Workspaces />
          </div>
        </Allotment.Pane>
        <Allotment.Pane visible={rightPaneOpen} {...rightPaneProps}>
          <DisclosureWrapper title="Test" defaultOpen={true}>
            <div>Placeholder</div>
          </DisclosureWrapper>
        </Allotment.Pane>
      </Allotment>
    </PageContext.Provider>
  );
}
