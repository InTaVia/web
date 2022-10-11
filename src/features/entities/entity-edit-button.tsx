import ClearIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { Fragment } from 'react';
import { useFieldArray } from 'react-final-form-arrays';

import type { Entity } from '@/api/entity.model';
import { eventTypes } from '@/features/common/event-types';
import { Form } from '@/features/form/form';
import { FormDateField } from '@/features/form/form-date-field';
import { FormSelect } from '@/features/form/form-select';
import { FormSubmitButton } from '@/features/form/form-submit-button';
import { FormTextArea } from '@/features/form/form-text-area';
import { FormTextField } from '@/features/form/form-text-field';
import { useDialogState } from '@/features/ui/use-dialog-state';

interface EntityEditButtonProps<T extends Entity> {
  entity: T;
  onSave: (entity: T) => void;
}

export function EntityEditButton<T extends Entity>(props: EntityEditButtonProps<T>): JSX.Element {
  const { entity, onSave } = props;

  const dialog = useDialogState();

  function onSubmit(values: T) {
    onSave(values);
    dialog.close();
  }

  return (
    <Fragment>
      <Button onClick={dialog.open} variant="outlined">
        Edit
      </Button>
      <Dialog fullWidth maxWidth="md" open={dialog.isOpen} onClose={dialog.close}>
        <DialogTitle component="h2" variant="h4">
          Edit {entity.kind}
        </DialogTitle>
        <Form<T> initialValues={entity} onSubmit={onSubmit}>
          <DialogContent dividers>
            <Box sx={{ display: 'grid', gap: 3 }}>
              <FormTextField label="Name" name="name" />
              <FormTextArea label="Description" name="description" rows={5} />
              <EntityHistoryFormSection />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={dialog.close}>Cancel</Button>
            <FormSubmitButton>Submit</FormSubmitButton>
          </DialogActions>
        </Form>
      </Dialog>
    </Fragment>
  );
}

function EntityHistoryFormSection(): JSX.Element {
  const historyFieldArray = useFieldArray('history', { subscription: {} });

  function onAdd() {
    historyFieldArray.fields.push({ type: undefined, date: undefined });
  }

  return (
    <Box component="section" sx={{ display: 'grid', gap: 2 }}>
      <Typography
        component="h3"
        variant="h5"
        sx={{
          borderBottom: (theme) => {
            return '1px solid ' + theme.palette.grey[200];
          },
          paddingBottom: 1,
        }}
      >
        Events
      </Typography>
      <List role="list" sx={{ display: 'grid', gap: 2 }}>
        {historyFieldArray.fields.map((name, index) => {
          function onRemove() {
            historyFieldArray.fields.remove(index);
          }

          return (
            <ListItem
              key={name}
              disablePadding
              sx={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr auto',
                gap: 1,
                alignItems: 'start',
              }}
            >
              <FormSelect label="Type" name={`${name}.type`}>
                {Object.values(eventTypes).map((eventType) => {
                  return (
                    <MenuItem key={eventType.id} value={eventType.id}>
                      {eventType.label}
                    </MenuItem>
                  );
                })}
              </FormSelect>
              <FormDateField label="Date" name={`${name}.date`} />
              <IconButton
                aria-label="Remove"
                color="error"
                onClick={onRemove}
                size="small"
                sx={{ alignSelf: 'center' }}
              >
                <ClearIcon fontSize="inherit" />
              </IconButton>
            </ListItem>
          );
        })}
      </List>
      <Button onClick={onAdd} sx={{ justifySelf: 'end' }} variant="outlined">
        Add
      </Button>
    </Box>
  );
}
