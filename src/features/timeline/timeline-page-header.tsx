import Box from '@mui/material/Box';

import { PageTitle } from '@/features/ui/page-title';

export function TimelinePageHeader(): JSX.Element {
  return (
    <Box
      component="header"
      sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}
    >
      <PageTitle>Timeline</PageTitle>
    </Box>
  );
}
