import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import IntegrationInstructionsOutlinedIcon from '@mui/icons-material/IntegrationInstructionsOutlined';
import { IconButton } from '@mui/material';
import { useState } from 'react';
import ReactResizeDetector from 'react-resize-detector';

import { ExcelUpload } from '@/features/excel-upload/ExcelUpload';
import { ButtonRow } from '@/features/storycreator/ButtonRow';
import styles from '@/features/storycreator/storycreator.module.css';
import type { Story } from '@/features/storycreator/storycreator.slice';
import { StoryGUICreator } from '@/features/storycreator/StoryGUICreator';
import { StoryTextCreator } from '@/features/storycreator/StoryTextCreator';

interface StoryCreatorProps {
  story: Story;
}

export function StoryCreator(props: StoryCreatorProps): JSX.Element {
  const { story } = props;

  const [textMode, setTextMode] = useState(false);

  function toggleTextMode(): void {
    setTextMode(!textMode);
  }

  return (
    <div className={styles['story-editor-wrapper']}>
      <div className={styles['story-editor-header']}>
        <div className={styles['story-editor-headline']}>{story.title}</div>
        <ButtonRow style={{ position: 'absolute', top: 0, right: 0 }}>
          <ExcelUpload />
          <div className={styles['button-row-button']}>
            <IconButton color="primary" onClick={toggleTextMode} component="span">
              <IntegrationInstructionsOutlinedIcon />
            </IconButton>
          </div>
        </ButtonRow>
      </div>
      <div className={styles['story-editor-content']}>
        {textMode ? (
          <StoryTextCreator story={story} />
        ) : (
          <ReactResizeDetector handleWidth handleHeight>
            {({ width, height, targetRef }) => {
              return (
                <StoryGUICreator
                  targetRef={targetRef}
                  width={width}
                  height={height}
                  story={story}
                />
              );
            }}
          </ReactResizeDetector>
        )}
      </div>
    </div>
  );
}
