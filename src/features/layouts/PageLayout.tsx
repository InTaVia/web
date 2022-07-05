import StoryCreatorIcon from '@mui/icons-material/AutoStoriesOutlined';
import CollectionsOutlinedIcon from '@mui/icons-material/CollectionsOutlined';
import DataSaverOnOutlinedIcon from '@mui/icons-material/DataSaverOnOutlined';
import GridViewIcon from '@mui/icons-material/GridViewOutlined';
import HomeIcon from '@mui/icons-material/HomeOutlined';
import TimelineIcon from '@mui/icons-material/LinearScale';
import MapIcon from '@mui/icons-material/MapOutlined';
import SearchIcon from '@mui/icons-material/SearchOutlined';
import ProfessionsIcon from '@mui/icons-material/Work';
import type { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import MuiAppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';

export interface PageLayoutProps {
  children?: ReactNode;
}

export function PageLayout(props: PageLayoutProps): JSX.Element {
  const { children } = props;

  const links = [
    { id: 'home', href: { pathname: '/' }, label: 'Home', icon: <HomeIcon /> },
    { id: 'search', href: { pathname: '/search' }, label: 'Search', icon: <SearchIcon /> },
    {
      id: 'visual-query',
      href: { pathname: '/visual-querying' },
      label: 'Visual Query',
      icon: <DataSaverOnOutlinedIcon />,
    },
    {
      id: 'collections',
      href: { pathname: '/collections' },
      label: 'Collections',
      icon: <CollectionsOutlinedIcon />,
    },
    { id: 'timeline', href: { pathname: '/timeline' }, label: 'Timeline', icon: <TimelineIcon /> },
    {
      id: 'professions',
      href: { pathname: '/professions' },
      label: 'Profession Hierarchy',
      icon: <ProfessionsIcon />,
    },
    { id: 'map', href: { pathname: '/geomap' }, label: 'Map', icon: <MapIcon /> },
    {
      id: 'coordination',
      href: { pathname: '/coordination' },
      label: 'Coordinated View',
      icon: <GridViewIcon />,
    },
    {
      id: 'storycreator',
      href: { pathname: '/storycreator' },
      label: 'Story Creator',
      icon: <StoryCreatorIcon />,
    },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed">
        <Toolbar>
          <Typography component="div" noWrap variant="h6">
            InTaVia
          </Typography>
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ flexGrow: 1, p: 1 }}>
        {children}
      </Box>
    </Box>
  );
}

type AppBarProps = MuiAppBarProps;

const AppBar = styled(MuiAppBar)<AppBarProps>(({ theme }) => {
  return {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  };
});
