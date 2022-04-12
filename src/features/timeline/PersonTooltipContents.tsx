import { Box, Typography } from '@mui/material';

import type { Person } from '@/features/common/entity.model';
import { PersonRelationListItem } from '@/features/timeline/PersonRelationListItem';

interface PersonTooltipContentsProps {
  person: Person;
}

export function PersonTooltipContents(props: PersonTooltipContentsProps): JSX.Element {
  const { person } = props;
  const hist = person.history || [];

  const relationList = hist.length ? (
    <Typography
      variant="body2"
      component="ul"
      sx={{
        listStyle: 'initial',
        paddingInlineStart: '1.5em',
        paddingBlock: '0.7em',
      }}
    >
      {hist.map((relation, i) => {
        return <PersonRelationListItem key={i} relation={relation} />;
      })}
    </Typography>
  ) : (
    ''
  );

  return (
    <Box>
      <Typography variant="h5">{person.name}</Typography>

      {relationList}

      <Typography variant="body2" component="p">
        {person.description}
      </Typography>
    </Box>
  );
}
