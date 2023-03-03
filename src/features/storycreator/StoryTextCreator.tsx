import '~/node_modules/react-grid-layout/css/styles.css';
import '~/node_modules/react-resizable/css/styles.css';

import { Button,  Textarea } from '@intavia/ui';
import type { FormEvent } from 'react';
import { createRef } from 'react';

import { useAppDispatch } from '@/app/store';
import styles from '@/features/storycreator/storycreator.module.css';
import type { Story } from '@/features/storycreator/storycreator.slice';
import { editStory } from '@/features/storycreator/storycreator.slice';

interface StoryTextCreatorProps {
  story: Story;
}

export function StoryTextCreator(props: StoryTextCreatorProps): JSX.Element {
  const { story } = props;

  const textAreaRef = createRef<HTMLTextAreaElement>();

  const dispatch = useAppDispatch();

  const slideOutput = Object.values(story.slides).map((s) => {
    const ret = { ...s };
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

  const handleSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (textAreaRef.current) {
      const newStory = { ...story, ...JSON.parse(textAreaRef.current.value) } as Story;
      event.currentTarget.reset();
      dispatch(editStory(newStory));
    }
  };

  return (
    <div>
      <form onSubmit={handleSave} id="storytexteditor">
        <Textarea
          ref={textAreaRef}
          className={styles['story-textarea']}
          defaultValue={JSON.stringify(storyObject, null, 2)}
        />
      </form>
      <Button type="submit" form="storytexteditor">
        Save
      </Button>
      <Button onClick={download}>Download</Button>
    </div>
  );
}
