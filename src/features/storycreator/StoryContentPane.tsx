import { AdjustmentsIcon } from '@heroicons/react/outline';
import { XIcon } from '@heroicons/react/solid';
import { Button, IconButton } from '@intavia/ui';
import ReactGridLayout from 'react-grid-layout';
import ReactResizeDetector from 'react-resize-detector';

import { useParams } from '@/app/route/use-params';
import { useAppDispatch, useAppSelector } from '@/app/store';
import type { QuizAnswer } from '@/features/common/component-property';
import type { Visualization } from '@/features/common/visualization.slice';
import ContentPaneWizard from '@/features/storycreator/content-pane-wizard';
import type {
  AnswerList,
  SlideContent,
  StoryImage,
  StoryTitle,
} from '@/features/storycreator/contentPane.slice';
import {
  removeSlideContent,
  resizeMoveContent,
  selectContentPaneByID,
} from '@/features/storycreator/contentPane.slice';
import { StoryTitleSlide } from '@/features/storycreator/story-title-slide';
import { selectStoryByID } from '@/features/storycreator/storycreator.slice';
import { StoryVideoAudio } from '@/features/storycreator/StoryVideoAudio';

const margin: [number, number] = [0, 0];

interface StoryContentPaneProps {
  id: string;
  setEditElement?: (element: SlideContent) => void;
  onDrop?: (i_layout: any, i_layoutItem: any, event: any, targetPane: any) => void;
  onContentPaneWizard?: (i_layout: any, type: string, i_targetPane: any) => void;
  handleSaveComponent: (element: SlideContent | Visualization) => void;
  singleContent?: boolean;
}

export function StoryContentPane(props: StoryContentPaneProps) {
  const { id, setEditElement, onDrop, onContentPaneWizard, handleSaveComponent, singleContent } =
    props;

  /* const myHeight =
    height !== undefined ? Math.floor((height + margin[1]) / (rowHeight + margin[1])) : 12; */

  const dispatch = useAppDispatch();

  const contentPane = useAppSelector((state) => {
    return selectContentPaneByID(state, id);
  });

  const params = useParams();
  const storyID = params?.get('id') ?? '';
  const story = useAppSelector((state) => {
    return selectStoryByID(state, storyID);
  });

  const fontFamily = story.properties.font.value.value;

  let contents: Array<SlideContent>;
  if (contentPane !== undefined) {
    contents = Object.values(contentPane.contents).map((content) => {
      return { ...content, parentPane: id };
    });
  } else {
    contents = [];
  }

  const removeWindowHandler = (element: SlideContent) => {
    dispatch(removeSlideContent({ parentPane: id, content: element }));
  };

  const createWindowContent = (element: SlideContent) => {
    switch (element.type) {
      case 'Text':
        return (
          <div style={{ height: '100%' }}>
            <div
              style={{
                height: '100%',
                maxHeight: '100%',
                position: 'relative',
                backgroundColor: 'white',
                padding: 0,
                fontFamily: fontFamily,
              }}
            >
              {(Boolean(element!.properties!.title!.value) ||
                Boolean(element!.properties!.text!.value)) && (
                <div className="p-2">
                  {Boolean(element!.properties!.title!.value) && (
                    <p className="mb-1 text-xl">{element!.properties!.title!.value}</p>
                  )}
                  {Boolean(element!.properties!.text!.value) && (
                    <p>{element!.properties!.text!.value}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      case 'Title':
        return (
          <StoryTitleSlide
            handleSaveComponent={handleSaveComponent}
            element={element as StoryTitle}
            editable
          />
        );
      case 'Quiz': {
        const quizContent = [];
        if (element.properties && element.properties.question) {
          if (element.properties.question.value) {
            quizContent.push(
              <div
                className="grid grid-cols-[auto] gap-1"
                style={{
                  fontFamily: fontFamily,
                }}
              >
                {(element.properties.answerlist as AnswerList).answers.map(
                  (answer: QuizAnswer, index: number) => {
                    return (
                      <div
                        key={`answer${index}`}
                        className={`p-1 ${
                          answer.correct === true ? 'bg-intavia-green-200' : 'bg-intavia-red-200'
                        }`}
                      >{`${answer.text}`}</div>
                    );
                  },
                )}
              </div>,
            );
          } else {
            quizContent.push('Please state a question for the quiz!');
          }
        }

        return (
          <div style={{ height: '100%' }}>
            <div
              style={{
                height: '100%',
                maxHeight: '100%',
                position: 'relative',
                backgroundColor: 'white',
                padding: 0,
              }}
            >
              <div className="p-2">
                {Boolean(element.properties!.question!.value) && (
                  <p className="mb-1 text-lg" style={{ fontFamily }}>
                    {element.properties!.question!.value}
                  </p>
                )}
                {quizContent}
              </div>
            </div>
          </div>
        );
      }
      case 'Image':
        return (
          <div
            style={{
              height: '100%',
              maxHeight: '100%',
              backgroundColor: 'white',
              padding: 0,
              fontFamily: fontFamily,
            }}
          >
            <div style={{ height: '100%' }}>
              <img
                src={
                  (element as StoryImage).properties.link?.value !== ''
                    ? (element as StoryImage).properties.link?.value
                    : 'https://via.placeholder.com/300'
                }
                alt="card"
                className="h-full w-full object-cover"
              />
            </div>
            {(element.properties!.title!.value !== '' ||
              element.properties!.text!.value !== '') && (
              <div className="absolute bottom-0 w-full bg-white p-2">
                {element.properties!.title!.value !== '' && (
                  <p className="mb-1 text-xl">{element.properties!.title!.value}</p>
                )}
                {element.properties!.text!.value !== '' && <p>{element.properties!.text!.value}</p>}
              </div>
            )}
          </div>
        );
      case 'Video/Audio':
        return <StoryVideoAudio content={element} fontFamily={fontFamily} />;
      default:
        return [];
    }
  };

  const myDrop = (i_layout: any, i_layoutItem: any, event: any) => {
    if (onDrop !== undefined && singleContent === false) onDrop(i_layout, i_layoutItem, event, id);
  };

  const createLayoutPane = (element: any) => {
    return (
      <div key={element.id} className={'overflow-hidden'}>
        <div className="flex flex-row flex-nowrap justify-between gap-2 truncate bg-intavia-blue-400 px-2 py-1 text-white">
          <div className="truncate">{element.type}</div>
          <div className="sticky right-0 flex flex-nowrap gap-1">
            <button
              aria-label="Edit"
              className="grid h-6 w-6 place-items-center rounded-full transition hover:bg-neutral-200 hover:text-neutral-700"
              onClick={() => {
                if (setEditElement !== undefined) {
                  setEditElement(element);
                }
              }}
            >
              <AdjustmentsIcon className="h-4 w-4" />
            </button>
            <button
              aria-label="Remove"
              className="grid h-6 w-6 place-items-center rounded-full transition hover:bg-neutral-200 hover:text-neutral-700"
              onClick={() => {
                removeWindowHandler(element);
              }}
            >
              <XIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
        {createWindowContent(element)}
      </div>
    );
  };

  const layout = [
    ...contents.map((content) => {
      return { i: content.id, ...content.layout };
    }),
    { i: 'contentPaneWizard', x: 0, y: 999, h: 1, w: 1, isResizable: false },
  ];

  return (
    <div className="grid h-full w-full bg-intavia-blue-200">
      <ReactResizeDetector handleWidth handleHeight>
        {({ width, height }) => {
          return (
            <ReactGridLayout
              className="layout"
              layout={layout}
              rowHeight={height !== undefined ? height / 8 : 60}
              margin={margin}
              cols={1}
              width={width}
              isDroppable={true}
              compactType={'vertical'}
              useCSSTransforms={true}
              isDraggable={true}
              style={{
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                overflowY: 'scroll',
              }}
              onDrop={myDrop}
              onResizeStop={(iLayout, element, resized) => {
                dispatch(
                  resizeMoveContent({
                    layout: resized,
                    parentPane: id,
                    content: element.i,
                    parentType: 'Content',
                  }),
                );
              }}
              onDragStop={(iLayout, element, dragged) => {
                dispatch(
                  resizeMoveContent({
                    layout: dragged,
                    parentPane: id,
                    parentType: 'Content',
                  }),
                );
              }}
            >
              {contents.map((content) => {
                return createLayoutPane(content);
              })}
              {(singleContent === false || contents.length === 0) && (
                <div key={'contentPaneWizard'}>
                  <ContentPaneWizard
                    mini={contents.length > 0 ? true : false}
                    onContentAddPerClick={(type: string) => {
                      if (onContentPaneWizard !== undefined) {
                        const maxLayoutY = Math.max(
                          ...contents.map((content) => {
                            return content.layout.y + content.layout.h;
                          }),
                        );
                        onContentPaneWizard({ y: maxLayoutY > 0 ? maxLayoutY : 1, x: 1 }, type, id);
                      }
                    }}
                  />
                </div>
              )}
            </ReactGridLayout>
          );
        }}
      </ReactResizeDetector>
    </div>
  );
}
