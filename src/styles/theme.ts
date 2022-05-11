import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  components: {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
    },
  },
  palette: {
    primary: {
      light: 'var(--gray)',
      main: 'var(--green)',
      dark: 'var(--dark-green)',
      contrastText: 'var(--white)',
    },
    secondary: {
      light: 'var(--blue)',
      main: 'var(--blue)',
      dark: 'var(--purple)',
      contrastText: 'var(--black)',
    },
  },
  typography: {
    fontSize: 12,
  },
});
