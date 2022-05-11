import '~/node_modules/react-grid-layout/css/styles.css';
import '~/node_modules/react-resizable/css/styles.css';

import { TextareaAutosize } from '@mui/material';
import { Responsive, WidthProvider } from 'react-grid-layout';

import { useAppDispatch, useAppSelector } from '@/features/common/store';
import styles from '@/features/storycreator/storycreator.module.css';
import {
  selectContentByStory,
  selectSlidesByStoryID,
} from '@/features/storycreator/storycreator.slice';

const ResponsiveGridLayout = WidthProvider(Responsive);

export default function StoryTextCreator(props): JSX.Element {
  const story = props.story;

  const dispatch = useAppDispatch();

  const slideOutput = Object.values(story.slides).map((s) => {
    const ret = { ...s };
    delete ret.image;
    return ret;
  });

  const storyObject = { ...story, slides: slideOutput };

  return (
    <TextareaAutosize className={styles['story-textarea']}>
      {JSON.stringify(storyObject, null, 2)}
    </TextareaAutosize>
  );
}
