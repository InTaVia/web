import { CardContent, CardMedia, Typography } from '@mui/material';
import Card from '@mui/material/Card';
import type { RefObject } from 'react';
import ReactGridLayout from 'react-grid-layout';

import { useAppDispatch } from '@/app/store';
import styles from '@/features/storycreator/storycreator.module.css';
import type {
  ContentPane,
  Slide,
  SlideContent,
  StoryAnswerList,
  StoryImage,
  StoryQuizAnswer,
} from '@/features/storycreator/storycreator.slice';
import { removeSlideContent, resizeMoveContent } from '@/features/storycreator/storycreator.slice';
import { Window } from '@/features/ui/Window';

const rowHeight = 30;
const margin: [number, number] = [0, 0];

interface StoryContentPaneProps {
  id: string;
  width: number | undefined;
  height: number | undefined;
  targetRef: RefObject<HTMLElement>;
  slide: Slide;
  setEditElement: (arg0: any) => void;
  setOpenDialog: (arg0: boolean) => void;
  contentPane: ContentPane | undefined;
  onDrop: (i_layout: any, i_layoutItem: any, event: any, targetPane: any) => void;
}

export function StoryContentPane(props: StoryContentPaneProps) {
  const {
    id,
    width: myWidth,
    /* height, */
    targetRef,
    contentPane,
    slide,
    setEditElement,
    setOpenDialog,
    onDrop,
  } = props;

  /* const myHeight =
    height !== undefined ? Math.floor((height + margin[1]) / (rowHeight + margin[1])) : 12; */

  const dispatch = useAppDispatch();

  let contents: Array<SlideContent>;
  if (contentPane !== undefined) {
    contents = Object.values(contentPane.contents).map((content) => {
      return { ...content, parentPane: id };
    });
  } else {
    contents = [];
  }

  const removeWindowHandler = (element: SlideContent) => {
    dispatch(removeSlideContent({ slide: slide, parentPane: id, content: element }));
  };

  const createWindowContent = (element: SlideContent) => {
    switch (element.type) {
      case 'Text':
        return (
          <div style={{ height: '100%' }}>
            <Card
              style={{
                height: '100%',
                maxHeight: '100%',
                position: 'relative',
                backgroundColor: 'white',
                padding: 0,
              }}
            >
              {(Boolean(element!.properties!.title!.value) ||
                Boolean(element!.properties!.text!.value)) && (
                <CardContent className={styles['card-content']}>
                  {Boolean(element!.properties!.title!.value) && (
                    <Typography gutterBottom variant="h5" component="h2">
                      {element!.properties!.title!.value}
                    </Typography>
                  )}
                  {Boolean(element!.properties!.text!.value) && (
                    <Typography variant="subtitle1" color="subtitle1" component="p">
                      {element!.properties!.text!.value}
                    </Typography>
                  )}
                </CardContent>
              )}
            </Card>
          </div>
        );
      case 'Quiz': {
        const quizContent = [];
        if (element.properties && element.properties.question) {
          if (element.properties.question.value) {
            quizContent.push(
              <Typography variant="subtitle1" color="subtitle1" component="p">
                {(element.properties.answerlist as StoryAnswerList).answers.map(
                  (answer: StoryQuizAnswer, index: number) => {
                    return (
                      <div
                        key={`answer${index}`}
                        style={{
                          backgroundColor: answer.correct === true ? '#f0fff0' : '#ff000047',
                        }}
                      >{`${answer.text}`}</div>
                    );
                  },
                )}
              </Typography>,
            );
          } else {
            quizContent.push('Please state a question for the quiz!');
          }
        }

        return (
          <div style={{ height: '100%' }}>
            <Card
              style={{
                height: '100%',
                maxHeight: '100%',
                position: 'relative',
                backgroundColor: 'white',
                padding: 0,
              }}
            >
              <CardContent className={styles['card-content']}>
                {Boolean(element.properties!.question!.value) && (
                  <Typography gutterBottom variant="h5" component="h2">
                    {element.properties!.question!.value}
                  </Typography>
                )}
                {quizContent}
              </CardContent>
            </Card>
          </div>
        );
      }
      case 'Image':
        return (
          <Card
            style={{
              height: '100%',
              maxHeight: '100%',
              position: 'relative',
              backgroundColor: 'white',
              padding: 0,
            }}
          >
            <div style={{ height: '100%' }}>
              <CardMedia
                component="img"
                image={
                  (element as StoryImage).properties.link?.value !== ''
                    ? (element as StoryImage).properties.link?.value
                    : 'https://via.placeholder.com/300'
                }
                alt="card image"
                height="100%"
              />
            </div>
            {(element.properties!.title!.value !== '' ||
              element.properties!.text!.value !== '') && (
              <CardContent className={styles['card-content']}>
                {element.properties!.title!.value !== '' && (
                  <Typography gutterBottom variant="h5" component="h2">
                    {element.properties!.title!.value}
                  </Typography>
                )}
                {element.properties!.text!.value !== '' && (
                  <Typography variant="subtitle1" color="textSecondary" component="p">
                    {element.properties!.text!.value}
                  </Typography>
                )}
              </CardContent>
            )}
          </Card>
        );
      default:
        return [];
    }
  };

  const myDrop = (i_layout: any, i_layoutItem: any, event: any) => {
    onDrop(i_layout, i_layoutItem, event, id);
  };

  const createLayoutPane = (element: any) => {
    switch (element.type) {
      case 'Text':
      case 'Image':
      case 'Quiz':
        return (
          <div key={element.id} className={styles.elevated}>
            <Window
              className={styles['annotation-window']}
              title={element.type}
              id={element.id}
              onRemoveWindow={() => {
                removeWindowHandler(element);
              }}
              onEditContent={() => {
                setEditElement(element);
                setOpenDialog(true);
              }}
              static={true}
            >
              {createWindowContent(element)}
            </Window>
          </div>
        );
      default:
        return;
    }
  };

  const layout = contents.map((content) => {
    return { i: content.id, ...content.layout };
  });

  return (
    <div
      ref={targetRef as RefObject<HTMLDivElement>}
      className={`${styles['slide-editor-wrapper']} bg-intavia-blue-200`}
    >
      <ReactGridLayout
        className="layout"
        layout={layout}
        rowHeight={rowHeight}
        margin={margin}
        cols={1}
        width={myWidth}
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
              slide: slide.id,
              story: slide.story,
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
              slide: slide.id,
              story: slide.story,
              parentPane: id,
              content: element.i,
              parentType: 'Content',
            }),
          );
        }}
      >
        {contents.map((content) => {
          return createLayoutPane(content);
        })}
      </ReactGridLayout>
    </div>
  );
}
