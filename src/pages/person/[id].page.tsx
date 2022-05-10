import ClearIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { skipToken } from '@reduxjs/toolkit/query/react';
import { formatISO } from 'date-fns';
import { Fragment, useState } from 'react';
import { useField } from 'react-final-form';
import { useFieldArray } from 'react-final-form-arrays';

import {
  addLocalEntity,
  selectEntitiesByKind,
  selectLocalEntitiesByKind,
} from '@/features/common/entities.slice';
import type { Entity, Person } from '@/features/common/entity.model';
import { useGetPersonByIdQuery } from '@/features/common/intavia-api.service';
import { useAppDispatch, useAppSelector } from '@/features/common/store';
import type { FormProps } from '@/features/form/form';
import { Form } from '@/features/form/form';
import { PageTitle } from '@/features/ui/PageTitle';
import { formatDate } from '@/lib/format-date';
import { useSearchParams } from '@/lib/use-search-params';

/**
 * Currently client-side only.
 */
export default function PersonPage(): JSX.Element {
  const searchParams = useSearchParams();
  const id = searchParams?.get('id');
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

  if (searchParams == null || getPersonByIdQuery.isLoading) {
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
                      <Typography>{event.type}</Typography>
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

  const formId = 'entity-edit';

  return (
    <Fragment>
      <Button onClick={dialog.open} variant="outlined">
        Edit
      </Button>
      <Dialog fullWidth maxWidth="sm" open={dialog.isOpen} onClose={dialog.close}>
        <DialogTitle component="h2" variant="h4">
          Edit {entity.kind}
        </DialogTitle>
        <DialogContent dividers>
          <EditEntityForm id={formId} initialValues={entity} onSubmit={onSubmit} />
        </DialogContent>
        <DialogActions>
          <Button onClick={dialog.close}>Cancel</Button>
          <Button form={formId} type="submit">
            Submit
          </Button>
        </DialogActions>
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

type EditEntityFormProps<T> = Pick<FormProps<T>, 'id' | 'initialValues' | 'onSubmit'>;

function EditEntityForm<T>(props: EditEntityFormProps<T>): JSX.Element {
  const { id, initialValues, onSubmit } = props;

  return (
    <Form<T> id={id} initialValues={initialValues} onSubmit={onSubmit}>
      <Box sx={{ display: 'grid', gap: 3 }}>
        <FormTextField label="Name" name="name" />
        <FormTextArea label="Description" name="description" rows={5} />
        <EntityHistoryFormSection />
        {/* <FormSpy>
          {(values) => {
            return <pre>{JSON.stringify(values, null, 2)}</pre>;
          }}
        </FormSpy> */}
      </Box>
    </Form>
  );
}

function EntityHistoryFormSection(): JSX.Element {
  const historyFieldArray = useFieldArray('history', { subscription: { value: true } });

  function onAdd() {
    historyFieldArray.fields.push(undefined);
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
              sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 1 }}
            >
              <FormTextField label="Type" name={`${name}.type`} />
              <FormDateField label="Date" name={`${name}.date`} />
              <IconButton aria-label="Remove" color="error" onClick={onRemove} size="small">
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

interface FormTextFieldProps {
  label: string;
  name: string;
}

function FormTextField(props: FormTextFieldProps): JSX.Element {
  const { name } = props;

  const field = useField(name);

  return <TextField {...props} {...field.input} />;
}

interface FormTextAreaProps {
  label: string;
  name: string;
  rows?: number;
}

function FormTextArea(props: FormTextAreaProps): JSX.Element {
  const { name } = props;

  const field = useField(name);

  return <TextField {...props} {...field.input} multiline />;
}

interface FormDateFieldProps {
  label: string;
  name: string;
}

function FormDateField(props: FormDateFieldProps): JSX.Element {
  const { name } = props;

  const field = useField(name, {
    format(value: IsoDateString | undefined) {
      if (value == null) return '';
      return formatISO(new Date(value), { representation: 'date' });
    },
    parse(value: string) {
      if (value === '') return undefined;
      return new Date(value).toISOString();
    },
  });

  return <TextField {...props} {...field.input} type="date" />;
}
