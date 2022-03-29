import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';

export interface PageTitleProps {
  children?: ReactNode;
}

export function PageTitle(props: PageTitleProps): JSX.Element {
  const { children } = props;

  return (
    <Typography component="h1" variant="h2">
      {children}
    </Typography>
  );
}
