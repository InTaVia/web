import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid';
import { Allotment } from 'allotment';
import type { ReactNode } from 'react';
import { useState } from 'react';
import ReactResizeDetector from 'react-resize-detector';

import AnalysePageToolbar from '@/features/ui/analyse-page-toolbar/toolbar';
import SidePane from '@/features/ui/side-pane';

interface ThreeColumnLayoutProps {
  leftContent: Array<Record<string, ReactNode>>;
  mainContent: ReactNode;
  rightContent: Array<Record<string, ReactNode>>;
}

export default function ThreeColumnLayout(props: ThreeColumnLayoutProps): JSX.Element {
  const {leftContent, mainContent, rightContent} = props;

  const [visibleLeftPane, setVisibleLeftPane] = useState(true);
  const [visibleRightPane, setVisibleRightPane] = useState(true);

  return (
    <Allotment
      vertical={false}
      onVisibleChange={(index, value) => {
        if (index === 0) {
          setVisibleLeftPane(value);
        } else if (index === 2) {
          setVisibleRightPane(value);
        }
      }}
    >
      {visibleLeftPane === true ? (
        <Allotment.Pane
          key={`allotmentLeft${visibleLeftPane}`}
          preferredSize="15%"
          minSize={200}
          visible={visibleLeftPane}
        >
          <SidePane setVisible={setVisibleLeftPane} content={leftContent} />
          {/* <div disclosureTitle="Data">
              <CollectionEntitiesList />
            </div>
            <div disclosureTitle="Search History">Test</div>
          </SidePane> */}
        </Allotment.Pane>
      ) : (
        <Allotment.Pane minSize={20} maxSize={20}>
          <button
            key="minimizeButton"
            onClick={() => {
              setVisibleLeftPane(true);
            }}
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </Allotment.Pane>
      )}

      <Allotment.Pane key="allotmentCenter" preferredSize="70%" minSize={400}>
        <div className="grid min-h-full grid-rows-[auto_1fr] bg-blue-500">
          {/* <AnalysePageToolbar
            onLayoutSelected={(key) => {
              return console.log('layout selected:', key);
            }}
          ></AnalysePageToolbar>
          <div>Content</div>
          <div>Tabbar</div> */}
          {mainContent}
        </div>
      </Allotment.Pane>

      {visibleRightPane === true ? (
        <Allotment.Pane
          key={`allotmentRight${visibleRightPane}`}
          preferredSize="15%"
          minSize={200}
          visible={visibleRightPane}
        >
          {/* <SidePane orientation="right" setVisible={setVisibleRightPane}>
            <div disclosureTitle="Placeholder">Placeholder</div>
            <div disclosureTitle="Placeholder">Placeholder</div>
          </SidePane> */}
          <ReactResizeDetector handleWidth handleHeight>
            {({ width }) => {
              if (width > 200) {
                return (
                  <SidePane orientation="right" setVisible={setVisibleRightPane} content={rightContent}/>
                    {/* <div disclosureTitle="Placeholder">Placeholder</div>
                    <div disclosureTitle="Placeholder">Placeholder</div>
                  </SidePane> */}
                );
              } else {
                return (
                  <div>
                    <button
                      key="minimizeButton"
                      onClick={() => {
                        setVisibleRightPane(true);
                      }}
                    >
                      <ChevronLeftIcon className="h-5 w-5" />
                    </button>
                  </div>
                );
              }
            }}
          </ReactResizeDetector>
        </Allotment.Pane>
      ) : (
        <Allotment.Pane minSize={20} maxSize={20}>
          <button
            key="minimizeButton"
            onClick={() => {
              setVisibleRightPane(true);
            }}
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
        </Allotment.Pane>
      )}
    </Allotment>
  );
}
