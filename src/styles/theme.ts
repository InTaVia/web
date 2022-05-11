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
    /** Material UI does not support custom properties as color values. */
    primary: {
      light: 'rgb(235 235 234)', // 'var(--gray)'
      main: 'rgb(132 177 91)', // 'var(--green)'
      dark: 'rgb(92 130 57)', // 'var(--dark-green)'
      contrastText: 'rgb(255 255 255)', // 'var(--white)'
    },
    secondary: {
      light: 'rgb(35 167 234)', // 'var(--light-blue)'
      main: 'rgb(35 167 234)', // 'var(--blue)'
      dark: 'rgb(120 66 163)', // 'var(--purple)'
      contrastText: 'rgb(0 0 0)', // 'var(--black)',
    },
  },
  typography: {
    fontSize: 12,
  },
});
