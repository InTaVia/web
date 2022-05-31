import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { Button, Checkbox, IconButton, TextField } from '@mui/material';
import { useState } from 'react';

import type { StoryAnswerList } from '@/features/storycreator/storycreator.slice';

interface StoryQuizAnswerListProps {
  answerList: StoryAnswerList;
}

export function StoryQuizAnswerList(props: StoryQuizAnswerListProps): JSX.Element {
  const { answerList } = props;

  /* let answers = [...answerList.answers]; */

  const [answers, setAnswers] = useState([...answerList.answers]);

  const addAnswer = () => {
    // eslint-disable-next-line prefer-const
    let newAnswers = [...answers];
    newAnswers.push(['...', false]);
    setAnswers(newAnswers);
  };

  const deleteAnswer = (index: number) => {
    // eslint-disable-next-line prefer-const
    let newAnswers = [...answers];
    newAnswers.splice(index, 1);
    setAnswers(newAnswers);
  };

  return (
    <div>
      {answers.map((answer, index: number) => {
        return (
          <div style={{ display: 'flex' }} className="storyAnswerListOption" key={`option${index}`}>
            <Checkbox defaultChecked={answer[1]} />
            <IconButton
              onClick={() => {
                deleteAnswer(index);
              }}
            >
              <DeleteForeverIcon />
            </IconButton>
            <TextField
              margin="dense"
              id={`answer${index}`}
              label={`Answer ${index + 1}`}
              fullWidth
              variant="standard"
              defaultValue={answer[0]}
              sx={{ width: '400px' }}
            />
          </div>
        );
      })}
      <Button onClick={addAnswer}>Add Answer</Button>
    </div>
  );
}
