import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Fragment } from 'react';

import type { Person } from '@intavia/api-client';
import { useAppDispatch } from '@/app/store';
import { addLocalEntity } from '@/app/store/intavia.slice';
import { eventTypes } from '@/features/common/event-types';
import { EntityEditButton } from '@/features/entities/entity-edit-button';
import { PageTitle } from '@/features/ui/page-title';
import { formatDate } from '@/lib/format-date';

interface PersonDetailsProps {
  person: Person;
}

export function PersonDetails(props: PersonDetailsProps): JSX.Element {
  const { person } = props;
  /*
  const dispatch = useAppDispatch();

  function onEdit(person: Person) {
    dispatch(addLocalEntity(person));
  } */

  return <pre>{JSON.stringify(person, null, 2)}</pre>;
}

{
  /*<Fragment>  <Box
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
                      <Typography>{eventTypes[event.type].label}</Typography>
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
      </Paper> </Fragment>*/
}
