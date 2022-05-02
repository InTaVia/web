import '~/node_modules/react-grid-layout/css/styles.css';
import '~/node_modules/react-resizable/css/styles.css';

import IntegrationInstructionsOutlinedIcon from '@mui/icons-material/IntegrationInstructionsOutlined';
import { IconButton } from '@mui/material';
import { useState } from 'react';

import { useAppDispatch, useAppSelector } from '@/features/common/store';
import styles from '@/features/storycreator/storycreator.module.css';
import { selectStoryByID } from '@/features/storycreator/storycreator.slice';

import ButtonRow from './ButtonRow';
import StoryGUICreator from './StoryGUICreator';
import StoryTextCreator from './StoryTextCreator';

export default function StoryCreator(props): JSX.Element {
  const storyID = props.storyID;

  const dispatch = useAppDispatch();

  const story = useAppSelector((state) => {
    return selectStoryByID(state, storyID);
  });

  const [textMode, setTextMode] = useState(false);

  function toggleTextMode(): void {
    setTextMode(!textMode);
  }

  return (
    <div className={styles['story-editor-wrapper']}>
      {story.title}
      <ButtonRow style={{ position: 'absolute', top: 0, right: 0 }}>
        <IconButton onClick={toggleTextMode}>
          <IntegrationInstructionsOutlinedIcon />
        </IconButton>
      </ButtonRow>
      <div className={styles['story-editor-content']}>
        {textMode ? (
          <StoryTextCreator story={story}></StoryTextCreator>
        ) : (
          <StoryGUICreator story={story}></StoryGUICreator>
        )}
      </div>
    </div>
  );
}
