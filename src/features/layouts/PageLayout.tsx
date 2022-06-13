import StoryCreatorIcon from '@mui/icons-material/AutoStoriesOutlined';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import CollectionsOutlinedIcon from '@mui/icons-material/CollectionsOutlined';
import DataSaverOnOutlinedIcon from '@mui/icons-material/DataSaverOnOutlined';
import GridViewIcon from '@mui/icons-material/GridViewOutlined';
import HomeIcon from '@mui/icons-material/HomeOutlined';
import TimelineIcon from '@mui/icons-material/LinearScale';
import MapIcon from '@mui/icons-material/MapOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/SearchOutlined';
import ProfessionsIcon from '@mui/icons-material/Work';
import type { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import MuiAppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import MuiDrawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import type { CSSObject, Theme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import type { ReactNode } from 'react';

import { useDialogState } from '@/features/ui/use-dialog-state';

export interface PageLayoutProps {
  children?: ReactNode;
}

export function PageLayout(props: PageLayoutProps): JSX.Element {
  const { children } = props;

  const drawer = useDialogState();

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
      <AppBar open={drawer.isOpen} position="fixed">
        <Toolbar>
          <IconButton
            aria-label="Open drawer"
            color="inherit"
            edge="start"
            onClick={drawer.open}
            sx={{ marginRight: 5, ...(drawer.isOpen && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography component="div" noWrap variant="h6">
            InTaVia
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={drawer.isOpen} variant="permanent">
        <DrawerHeader>
          <IconButton onClick={drawer.close}>
            <ChevronLeftIcon />
          </IconButton>
        </DrawerHeader>
        <Divider />
        <nav>
          <List component="ul" role="list">
            {links.map((link) => {
              return (
                <ListItem key={link.id} disablePadding sx={{ display: 'block' }}>
                  <Link href={link.href} passHref>
                    <ListItemButton
                      // @see {@link https://github.com/mui/material-ui/issues/29030}
                      component="a"
                      sx={{
                        minHeight: 48,
                        justifyContent: drawer.isOpen ? 'initial' : 'center',
                        px: 2.5,
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: drawer.isOpen ? 3 : 'auto',
                          justifyContent: 'center',
                        }}
                      >
                        {link.icon}
                      </ListItemIcon>
                      <ListItemText primary={link.label} sx={{ opacity: drawer.isOpen ? 1 : 0 }} />
                    </ListItemButton>
                  </Link>
                </ListItem>
              );
            })}
          </List>
        </nav>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 1 }}>
        <DrawerHeader />
        {children}
      </Box>
    </Box>
  );
}

/**
 * Copied from {@link https://mui.com/components/drawers/#mini-variant-drawer}.
 */

const drawerWidth = 240;

function openedMixin(theme: Theme): CSSObject {
  return {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
  };
}

function closedMixin(theme: Theme): CSSObject {
  return {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
      width: `calc(${theme.spacing(8)} + 1px)`,
    },
  };
}

const DrawerHeader = styled('div')(({ theme }) => {
  return {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
  };
});

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => {
    return prop !== 'open';
  },
})<AppBarProps>(({ theme, open }) => {
  return {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open === true && {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  };
});

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => {
    return prop !== 'open';
  },
})(({ theme, open }) => {
  return {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open === true && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(open !== true && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  };
});
