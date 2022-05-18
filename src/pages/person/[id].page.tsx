import ClearIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { skipToken } from '@reduxjs/toolkit/query/react';
import { useRouter } from 'next/router';
import { Fragment, useState } from 'react';
import { useFieldArray } from 'react-final-form-arrays';

import {
  addLocalEntity,
  selectEntitiesByKind,
  selectLocalEntitiesByKind,
} from '@/features/common/entities.slice';
import type { Entity, Person } from '@/features/common/entity.model';
import { person } from '@/features/common/entity.validation-schema';
import { useGetPersonByIdQuery } from '@/features/common/intavia-api.service';
import { useAppDispatch, useAppSelector } from '@/features/common/store';
import { Form } from '@/features/form/form';
import { FormDateField } from '@/features/form/form-date-field';
import { FormSelect } from '@/features/form/form-select';
import { FormSubmitButton } from '@/features/form/form-submit-button';
import { FormTextArea } from '@/features/form/form-text-area';
import { FormTextField } from '@/features/form/form-text-field';
import { validateSchema } from '@/features/form/validate-schema';
import { PageTitle } from '@/features/ui/PageTitle';
import { formatDate } from '@/lib/format-date';

export default function PersonPage(): JSX.Element {
  const router = useRouter();
  const _id = router.query['id'];
  const id = _id != null && Array.isArray(_id) ? _id[0] : _id;
  const dispatch = useAppDispatch();
  const entitiesByKind = useAppSelector(selectEntitiesByKind);
  const localEntitiesByKind = useAppSelector(selectLocalEntitiesByKind);
  // TODO: force displaying upstream entity with `upstream` search param
  const entity =
    id != null ? localEntitiesByKind.person[id] ?? entitiesByKind.person[id] : undefined;
  // TODO: check if rtkq has something similar to react query's `initialData`
  const getPersonByIdQuery = useGetPersonByIdQuery(
    id != null && entity == null ? { id } : skipToken,
  );
  const person = entity ?? getPersonByIdQuery.data;

  if (id == null || getPersonByIdQuery.isLoading) {
    return (
      <Container maxWidth="md" sx={{ display: 'grid', gap: 4, padding: 4, placeItems: 'center' }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  if (person == null || person.kind !== 'person') {
    return (
      <Container maxWidth="md" sx={{ display: 'grid', gap: 4, padding: 4, placeItems: 'center' }}>
        <Typography>Not found.</Typography>
      </Container>
    );
  }

  function onEdit(person: Person) {
    dispatch(addLocalEntity(person));
  }

  const eventTypes = { birth: 'beginning', death: 'end' };
  const birth = person.history?.find((relation) => {
    return relation.type === eventTypes.birth;
  });
  const death = person.history?.find((relation) => {
    return relation.type === eventTypes.death;
  });
  const history =
    person.history
      ?.filter((relation) => {
        return ![eventTypes.birth, eventTypes.death].includes(relation.type);
      })
      ?.sort((a, b) => {
        const _a = a.date == null ? 0 : new Date(a.date).getTime();
        const _b = b.date == null ? 0 : new Date(b.date).getTime();
        return _a === _b ? 0 : _a > _b ? 1 : -1;
      }) ?? [];

  return (
    <Container maxWidth="md" sx={{ display: 'grid', gap: 4, padding: 4 }}>
      <Box
        component="header"
        sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 2 }}
      >
        <PageTitle>{person.name}</PageTitle>
        <EntityEditButton entity={person} onSave={onEdit} />
      </Box>
      <Paper sx={{ padding: 4, maxWidth: '100%', overflow: 'auto', display: 'grid', gap: 4 }}>
        <Box
          component="dl"
          sx={{ display: 'grid', columnGap: 3, rowGap: 2, gridTemplateColumns: 'auto 1fr' }}
        >
          {birth != null ? (
            <Fragment>
              {birth.date != null ? (
                <Fragment>
                  <Typography component="dt" fontWeight={500}>
                    Date of birth
                  </Typography>
                  <Typography component="dd" color="text.secondary">
                    {formatDate(new Date(birth.date))}
                  </Typography>
                </Fragment>
              ) : null}
              {birth.place != null ? (
                <Fragment>
                  <Typography component="dt" fontWeight={500}>
                    Place of birth
                  </Typography>
                  <Typography component="dd" color="text.secondary">
                    {birth.place.name}
                  </Typography>
                </Fragment>
              ) : null}
            </Fragment>
          ) : null}
          {death != null ? (
            <Fragment>
              {death.date != null ? (
                <Fragment>
                  <Typography component="dt" fontWeight={500}>
                    Date of death
                  </Typography>
                  <Typography component="dd" color="text.secondary">
                    {formatDate(new Date(death.date))}
                  </Typography>
                </Fragment>
              ) : null}
              {death.place != null ? (
                <Fragment>
                  <Typography component="dt" fontWeight={500}>
                    Place of death
                  </Typography>
                  <Typography component="dd" color="text.secondary">
                    {death.place.name}
                  </Typography>
                </Fragment>
              ) : null}
            </Fragment>
          ) : null}
          {Array.isArray(person.occupation) && person.occupation.length > 0 ? (
            <Fragment>
              <Typography component="dt" fontWeight={500}>
                Occupations
              </Typography>
              <Typography component="dd" color="text.secondary">
                {person.occupation.join(', ')}
              </Typography>
            </Fragment>
          ) : null}
          {Array.isArray(person.categories) && person.categories.length > 0 ? (
            <Fragment>
              <Typography component="dt" fontWeight={500}>
                Categories
              </Typography>
              <Typography component="dd" color="text.secondary">
                {person.categories.join(', ')}
              </Typography>
            </Fragment>
          ) : null}
        </Box>
        <Typography variant="body1" lineHeight={1.75}>
          {person.description}
        </Typography>
        {history.length > 0 ? (
          <Box component="section" sx={{ display: 'grid', gap: 1 }}>
            <Typography
              component="h2"
              sx={{
                borderBottom: (theme) => {
                  return '1px solid ' + theme.palette.grey[200];
                },
                paddingBottom: 1,
              }}
              variant="h5"
            >
              Events
            </Typography>
            <List role="list" sx={{ display: 'grid', gap: 2 }}>
              {history.map((event, index) => {
                // TODO: events should have label and description
                return (
                  <ListItem key={index} disablePadding>
                    <Box component="article">
                      <Typography>
                        {event.type in relationTypes
                          ? relationTypes[event.type as keyof typeof relationTypes].label
                          : event.type}
                      </Typography>
                      <Typography color="text.secondary">
                        {event.date != null ? (
                          <span>{formatDate(new Date(event.date))}</span>
                        ) : null}{' '}
                        {event.place != null ? <span>in {event.place.name}</span> : null}
                      </Typography>
                    </Box>
                  </ListItem>
                );
              })}
            </List>
          </Box>
        ) : null}
      </Paper>
    </Container>
  );
}

interface EntityEditButtonProps<T extends Entity> {
  entity: T;
  onSave: (entity: T) => void;
}

function EntityEditButton<T extends Entity>(props: EntityEditButtonProps<T>): JSX.Element {
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
        <Form<T> initialValues={entity} onSubmit={onSubmit} validate={validateSchema(person)}>
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

interface UseDialogStateResult {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

function useDialogState(): UseDialogStateResult {
  const [isOpen, setIsOpen] = useState(false);

  function open() {
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
  }

  function toggle() {
    setIsOpen((isOpen) => {
      return !isOpen;
    });
  }

  return {
    isOpen,
    open,
    close,
    toggle,
  };
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
                {Object.values(relationTypes).map((relationType) => {
                  return (
                    <MenuItem key={relationType.id} value={relationType.id}>
                      {relationType.label}
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

// FIXME: see mocks/event-types and mocks/db
const relationTypes = {
  // FIXME: why generic `beginning` and `end` instead of entity-type specific, e.g. `birth` and `death` for `person`
  beginning: { id: 'beginning', label: 'Beginning' },
  end: { id: 'end', label: 'End' },
  stayed: { id: 'stayed', label: 'Stayed at' },
  lived: { id: 'lived', label: 'Lived in' },
  'statue erected': { id: 'statue erected', label: 'Statue erected' },
  'was in contact with': { id: 'was in contact with', label: 'Was in contact with' },
  'was related to': { id: 'was related to', label: 'Was related to' },
};
