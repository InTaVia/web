import { Allotment } from 'allotment';

import { withDictionaries } from '@/app/i18n/with-dictionaries';
import { useAppSelector } from '@/app/store';
import { CollectionEntitiesList } from '@/features/data-view-panel/data-view-panel';
import AnalysePageToolbar from '@/features/ui/analyse-page-toolbar/toolbar';
import DisclosureWrapper from '@/features/ui/DisclosureWrapper';
import { centerPaneProps, leftPaneProps, rightPaneProps } from '@/features/ui/panes.config';
import { selectPaneOpen } from '@/features/ui/ui.slice';

export const getStaticProps = withDictionaries(['common']);

export default function AnalysePage(): JSX.Element {
  const leftPaneOpen = useAppSelector((state) => {
    return selectPaneOpen(state, 'vas', 'left');
  });

  const rightPaneOpen = useAppSelector((state) => {
    return selectPaneOpen(state, 'vas', 'right');
  });

  return (
    <Allotment>
      <Allotment.Pane visible={leftPaneOpen} {...leftPaneProps}>
        <DisclosureWrapper title="Data" defaultOpen={true}>
          <CollectionEntitiesList />
        </DisclosureWrapper>
        <DisclosureWrapper title="Search History" defaultOpen={true}></DisclosureWrapper>
      </Allotment.Pane>
      <Allotment.Pane {...centerPaneProps}>
        <AnalysePageToolbar
          onLayoutSelected={() => {
            console.log('Yay, you selected a layout, good job!');
          }}
        />
      </Allotment.Pane>
      <Allotment.Pane visible={rightPaneOpen} {...rightPaneProps}>
        <DisclosureWrapper title="Test" defaultOpen={true}>
          <div>Placeholder</div>
        </DisclosureWrapper>
      </Allotment.Pane>
    </Allotment>
  );
}
