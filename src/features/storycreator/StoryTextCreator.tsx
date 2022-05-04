import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import { TextareaAutosize } from '@mui/material';

// import { Responsive, WidthProvider } from 'react-grid-layout';
import { useAppSelector } from '@/features/common/store';
import styles from '@/features/storycreator/storycreator.module.css';
import type { Story } from '@/features/storycreator/storycreator.slice';
import {
  selectContentByStory,
  selectSlidesByStoryId,
} from '@/features/storycreator/storycreator.slice';

// const ResponsiveGridLayout = WidthProvider(Responsive);

interface StoryTextCreatorProps {
  story: Story;
}

export function StoryTextCreator(props: StoryTextCreatorProps): JSX.Element {
  const { story } = props;

  const slides = useAppSelector((state) => {
    return selectSlidesByStoryId(state, story.id);
  });

  const allSlidesContent = useAppSelector((state) => {
    return selectContentByStory(state, story);
  });

  const slideOutput = slides.map((slide: any) => {
    const ret = {
      ...slide,
      content: allSlidesContent.filter((content: any) => {
        return content.slide === slide.i;
      }),
    };

    delete ret.image;
    return ret;
  });

  const storyObject = { ...story, slides: slideOutput };

  return (
    <TextareaAutosize
      className={styles['story-textarea']}
      value={JSON.stringify(storyObject, null, 2)}
    />
  );
}
