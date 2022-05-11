import '~/node_modules/react-grid-layout/css/styles.css';
import '~/node_modules/react-resizable/css/styles.css';

import { Button, TextareaAutosize } from '@mui/material';

import styles from '@/features/storycreator/storycreator.module.css';
import type { Story } from '@/features/storycreator/storycreator.slice';

interface StoryTextCreatorProps {
  story: Story;
}

export function StoryTextCreator(props: StoryTextCreatorProps): JSX.Element {
  const { story } = props;

  const slideOutput = Object.values(story.slides).map((s) => {
    const ret = { ...s };
    // @ts-expect-error Ignore
    delete ret.image;
    return ret;
  });

  const storyObject = { ...story, slides: slideOutput };

  const download = () => {
    const element = document.createElement('a');
    const textFile = new Blob([JSON.stringify(storyObject)], { type: 'text/plain' }); //pass data from localStorage API to blob
    element.href = URL.createObjectURL(textFile);
    element.download = `${storyObject['title']}_story_export.txt`;
    document.body.appendChild(element);
    element.click();
  };

  return (
    <div>
      <TextareaAutosize
        className={styles['story-textarea']}
        defaultValue={JSON.stringify(storyObject, null, 2)}
      />
      <Button onClick={download}>Download</Button>
    </div>
  );
}
