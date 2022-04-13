import Box from '@mui/material/Box';

import { PageTitle } from '@/features/ui/PageTitle';

export function SearchPageHeader(): JSX.Element {
  return (
    <Box
      component="header"
      sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}
    >
      <PageTitle>Search</PageTitle>
    </Box>
  );
}
