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
import type { FormEvent } from 'react';

import type {
  SlideContent,
  StoryContentProperty,
} from '@/features/storycreator/storycreator.slice';

interface StoryContentDialogProps {
  open: boolean;
  element: SlideContent;
  onClose: () => void;
  onSave: (event: FormEvent<HTMLFormElement>, element: SlideContent) => void;
}

export function StoryContentDialog(props: StoryContentDialogProps): JSX.Element {
  const { open, element, onClose, onSave } = props;

  const editableAttributes = Object.values(element.properties)
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
            onSave(event, element);
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
