import { Box, Typography } from '@mui/material';

import type { Person } from '@intavia/api-client';
import { getTranslatedLabel } from '@/lib/get-translated-label';

interface PersonTooltipContentsProps {
  person: Person;
}

export function PersonTooltipContents(props: PersonTooltipContentsProps): JSX.Element {
  const { person } = props;

  return (
    <Box>
      <Typography variant="h5">{getTranslatedLabel(person.label)}</Typography>

      <pre>{}</pre>

      <Typography variant="body2" component="p">
        {person.description}
      </Typography>
    </Box>
  );
}
