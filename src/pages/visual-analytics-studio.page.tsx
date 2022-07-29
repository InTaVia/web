import { Allotment } from 'allotment';
import type { LayoutPriority } from 'allotment/dist/types/src/split-view';

import { withDictionaries } from '@/app/i18n/with-dictionaries';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { CollectionEntitiesList } from '@/features/data-view-panel/data-view-panel';
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
    <Allotment>
      <Allotment.Pane
        priority={'LOW' as LayoutPriority}
        className="grid overflow-auto"
        visible={leftPaneOpen}
        {...leftPaneProps}
      >
        <DisclosureWrapper title="Data" defaultOpen={true}>
          <CollectionEntitiesList />
        </DisclosureWrapper>
        <DisclosureWrapper title="Search History" defaultOpen={true}></DisclosureWrapper>
      </Allotment.Pane>
      <Allotment.Pane {...centerPaneProps}>
        <div className="flex h-full w-full flex-col bg-red-100">
          <AnalysePageToolbar onLayoutSelected={onLayoutSelected} />
          <Workspaces />
        </div>
      </Allotment.Pane>
      <Allotment.Pane
        priority={'LOW' as LayoutPriority}
        className="grid overflow-auto"
        visible={rightPaneOpen}
        {...rightPaneProps}
      >
        <DisclosureWrapper title="Details" defaultOpen={true}>
          <div>DetailPanel</div>
        </DisclosureWrapper>
        <DisclosureWrapper title="Settings" defaultOpen={true}>
          <div>SettingsPanel</div>
        </DisclosureWrapper>
      </Allotment.Pane>
    </Allotment>
  );
}
