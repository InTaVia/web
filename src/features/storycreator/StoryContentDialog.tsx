import '~/node_modules/react-grid-layout/css/styles.css';
import '~/node_modules/react-resizable/css/styles.css';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  TextField,
} from '@mui/material';

interface StoryContentDialog {
  open: boolean;
  element: object;
  onClose: () => void;
  onSave: () => void;
}

const contentTypes: obj = {
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

export function StoryContentDialog(props: StoryContentDialog): JSX.Element {
  const { open, element, onClose, onSave } = props;
  const attributes = contentTypes[element.type];

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
            {Object.keys(attributes).map((attributeName: string) => {
              const attribute = attributes[attributeName];
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
