import '~/node_modules/react-grid-layout/css/styles.css';
import '~/node_modules/react-resizable/css/styles.css';

import { Button, FormControl, TextareaAutosize } from '@mui/material';

import { useAppDispatch } from '@/features/common/store';
import styles from '@/features/storycreator/storycreator.module.css';
import type { Story } from '@/features/storycreator/storycreator.slice';
import { editStory } from '@/features/storycreator/storycreator.slice';

interface StoryTextCreatorProps {
  story: Story;
}

export function StoryTextCreator(props: StoryTextCreatorProps): JSX.Element {
  const { story } = props;

  const dispatch = useAppDispatch();

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

  const handleSave = (event) => {
    event.preventDefault();
    let newStory: Story = { ...story };
    for (const tar of event.target) {
      newStory = { ...JSON.parse(tar.value) } as Story;
      break;
    }
    event.target.reset();
    dispatch(editStory(newStory));
  };

  return (
    <div>
      <form onSubmit={handleSave} id="storytexteditor">
        <FormControl style={{ width: '100%' }}>
          <TextareaAutosize
            className={styles['story-textarea']}
            defaultValue={JSON.stringify(storyObject, null, 2)}
          />
        </FormControl>
      </form>
      <Button type="submit" form="storytexteditor">
        Save
      </Button>
      <Button onClick={download}>Download</Button>
    </div>
  );
}