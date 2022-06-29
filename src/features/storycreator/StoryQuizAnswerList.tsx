import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { Button, Checkbox, IconButton, TextField } from '@mui/material';
import { useState } from 'react';

import type { StoryAnswerList } from '@/features/storycreator/storycreator.slice';

interface StoryQuizAnswerListProps {
  answerList: StoryAnswerList;
  setAnswerListForQuiz: (answers: any) => void;
}

export function StoryQuizAnswerList(props: StoryQuizAnswerListProps): JSX.Element {
  const { answerList, setAnswerListForQuiz } = props;

  const [answers, setAnswers] = useState([...answerList.answers]);

  const onChange = (event: any) => {
    console.log(event.target.id, event.target, event.target.value);
    // eslint-disable-next-line prefer-const
    let newAnswers = [...answers];
    const index = parseInt(event.target.name);

    switch (event.target.type) {
      case 'checkbox':
        newAnswers[index][1] = event.target.checked;
        break;
      case 'text':
        newAnswers[index][0] = event.target.value;
        break;
      default:
        break;
    }

    setAnswers(newAnswers);
    setAnswerListForQuiz(newAnswers);
  };

  const addAnswer = () => {
    // eslint-disable-next-line prefer-const
    let newAnswers = [...answers];
    newAnswers.push(['...', false]);
    setAnswers(newAnswers);
    setAnswerListForQuiz(newAnswers);
  };

  const deleteAnswer = (index: number) => {
    // eslint-disable-next-line prefer-const
    let newAnswers = [...answers];
    newAnswers.splice(index, 1);
    setAnswers(newAnswers);
    setAnswerListForQuiz(newAnswers);
  };

  return (
    <div>
      {answers.map((answer, index: number) => {
        return (
          <div style={{ display: 'flex' }} className="storyAnswerListOption" key={`option${index}`}>
            <Checkbox
              key={`answer${index + 1}Checkbox`}
              id={`answer${index + 1}Checkbox`}
              name={`${index}`}
              checked={answer[1]}
              onChange={onChange}
            />
            <IconButton
              key={`answer${index + 1}Delete`}
              onClick={() => {
                deleteAnswer(index);
              }}
            >
              <DeleteForeverIcon />
            </IconButton>
            <TextField
              margin="dense"
              label={`Answer ${index + 1}`}
              key={`answer${index + 1}`}
              id={`answer${index + 1}`}
              name={`${index}`}
              fullWidth
              variant="standard"
              defaultValue={answer[0]}
              sx={{ width: '400px' }}
              onChange={onChange}
            />
          </div>
        );
      })}
      <Button onClick={addAnswer}>Add Answer</Button>
    </div>
  );
}
