import { Box, Typography } from '@mui/material';

import type { Person } from '@/api/intavia.models';
import { PersonEventListItem } from '@/features/timeline/person-event-list-item';

interface PersonTooltipContentsProps {
  person: Person;
}

export function PersonTooltipContents(props: PersonTooltipContentsProps): JSX.Element {
  const { person } = props;
  const history = person.history || [];

  const events =
    history.length > 0 ? (
      <Typography
        variant="body2"
        component="ul"
        sx={{
          listStyle: 'initial',
          paddingInlineStart: '1.5em',
          paddingBlock: '0.7em',
        }}
      >
        {history.map((event, i) => {
          return <PersonEventListItem key={i} event={event} />;
        })}
      </Typography>
    ) : (
      ''
    );

  return (
    <Box>
      <Typography variant="h5">{person.name}</Typography>

      {events}

      <Typography variant="body2" component="p">
        {person.description}
      </Typography>
    </Box>
  );
}
