import Box from '@mui/material/Box';

import { PageTitle } from '@/features/ui/page-title';

export function ProfessionsPageHeader(): JSX.Element {
  return (
    <Box
      component="header"
      sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}
    >
      <PageTitle>Profession Hierarchy</PageTitle>
    </Box>
  );
}
