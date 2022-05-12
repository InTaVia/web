import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  TextField,
} from '@mui/material';
import type { FormEvent } from 'react';

// FIXME: needs proper types somewhere else
type StoryElementType = 'Image' | 'Text';

const contentTypes = {
  Image: {
    link: { label: 'Image Link', type: 'Text', sort: 0 },
    title: { label: 'Image Title', type: 'Text', sort: 1 },
    text: { label: 'Caption Text', type: 'Text', sort: 2 },
  },
  Text: {
    text: { label: 'Text', type: 'Text', sort: 0 },
    title: { label: 'Title', type: 'Text', sort: 1 },
  },
};

interface StoryContentDialogProps<T = any> {
  open: boolean;
  element: T; // FIXME:
  onClose: () => void;
  onSave: (event: FormEvent<HTMLFormElement>, element: T) => void;
}

export function StoryContentDialog(props: StoryContentDialogProps): JSX.Element {
  const { open, element, onClose, onSave } = props;
  const attributes = contentTypes[element.type as StoryElementType];

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
            {Object.entries(attributes).map(([attributeName, attribute]) => {
              return (
                <TextField
                  margin="dense"
                  id={attributeName}
                  key={attributeName}
                  label={attribute.label}
                  type={attribute.type}
                  fullWidth
                  variant="standard"
                  defaultValue={element[attributeName]}
                  sx={{ width: '500px' }}
                />
              );
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
