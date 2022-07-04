import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  TextareaAutosize,
  TextField,
} from '@mui/material';
import { useState } from 'react';

import type {
  SlideContent,
  StoryAnswerList,
  StoryContentProperty,
  StoryQuizAnswer,
} from '@/features/storycreator/storycreator.slice';
import { StoryQuizAnswerList } from '@/features/storycreator/StoryQuizAnswerList';

interface StoryContentDialogProps {
  open: boolean;
  element: SlideContent;
  onClose: () => void;
  onSave: (element: SlideContent) => void;
}

export function StoryContentDialog(props: StoryContentDialogProps): JSX.Element {
  const { open, element, onClose, onSave } = props;

  const [tmpProperties, setTmpProperties] = useState({ ...element.properties });

  const onChange = (event: any) => {
    const newVal = { ...tmpProperties[event.target.id], value: event.target.value };
    setTmpProperties({ ...tmpProperties, [event.target.id]: newVal });
  };

  const setAnswerListForQuiz = (answers: Array<StoryQuizAnswer>) => {
    const newVal = { ...tmpProperties.answerlist, answers: answers } as StoryAnswerList;
    setTmpProperties({ ...tmpProperties, answerlist: newVal });
  };

  const editableAttributes = Object.values(element.properties as object)
    .filter((prop: StoryContentProperty) => {
      return prop.editable;
    })
    .sort((a: StoryContentProperty, b: StoryContentProperty) => {
      return a.sort - b.sort;
    });

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{`Edit ${element.type}`}</DialogTitle>
      <DialogContent>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            const newElement = { ...element, properties: tmpProperties };
            onSave(newElement);
          }}
          id="myform"
        >
          <FormControl>
            {editableAttributes.map((property: StoryContentProperty) => {
              switch (property.type) {
                case 'text':
                  return (
                    <TextField
                      margin="dense"
                      id={property.id}
                      key={property.label}
                      label={property.label}
                      fullWidth
                      variant="standard"
                      defaultValue={property.value}
                      sx={{ width: '500px' }}
                      onChange={onChange}
                    />
                  );
                case 'textarea':
                  return (
                    <TextareaAutosize
                      id={property.id}
                      key={property.label}
                      defaultValue={property.value}
                      placeholder={property.label}
                      style={{ width: '100%' }}
                      minRows={3}
                      onChange={onChange}
                    />
                  );
                case 'answerlist':
                  return (
                    <StoryQuizAnswerList
                      key={property.label}
                      setAnswerListForQuiz={setAnswerListForQuiz}
                      answerList={property as StoryAnswerList}
                    />
                  );
              }
            })}
          </FormControl>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" form="myform" onClick={onClose}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
