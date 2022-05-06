import { lightBlue } from '@mui/material/colors';
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
      light: 'rgb(189, 238, 45)',
      main: 'rgb(132, 177, 91)',
      dark: 'rgb(92, 130, 57)',
      contrastText: '#fff',
    },
    secondary: {
      light: 'rgb(35, 167, 234)',
      main: 'rgb(35, 167, 234)',
      dark: 'rgb(120, 66, 163)',
      contrastText: '#000',
    },
  },
  typography: {
    fontSize: 12,
  },
});
