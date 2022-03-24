import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';

export function SearchPageHeader(): JSX.Element {
  return (
    <PageHeader>
      <PageTitle>Search</PageTitle>
    </PageHeader>
  );
}

function PageHeader(props: { children: ReactNode }): JSX.Element {
  const { children } = props;

  return (
    <Box
      component="header"
      sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}
    >
      {children}
    </Box>
  );
}

function PageTitle(props: { children: ReactNode }): JSX.Element {
  const { children } = props;

  return (
    <Typography component="h1" variant="h2">
      {children}
    </Typography>
  );
}
