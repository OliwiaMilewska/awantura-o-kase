import React, { useCallback, useMemo } from 'react';
import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  useMediaQuery,
  useTheme,
  createTheme
} from '@mui/material';
import AppLogo from '../../images/AppLogo';
import { ThemeProvider } from '@mui/material/styles';
import SmallScreenMenu from './SmallScreenMenu';
import { MAIN_PAGES } from './constants';
import { UserMenu } from './UserMenu';

const NAVBAR_BACKGROUND_COLOR = '#FFB703';

const theme = createTheme({
  components: {
    MuiMenu: {
      styleOverrides: {
        list: {
          '&[role="menu"]': {
            backgroundColor: NAVBAR_BACKGROUND_COLOR
          }
        }
      }
    }
  }
});

export default function TopBar() {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);

  const defaultTheme = useTheme();
  const isXs = useMediaQuery(defaultTheme.breakpoints.down('md'));
  const isMdUp = useMediaQuery(defaultTheme.breakpoints.up('md'));

  const handleCloseNavMenu = useCallback(() => {
    setAnchorElNav(null);
  }, []);

  const menuPages = useMemo(
    () =>
      MAIN_PAGES.map((page) => (
        <Button
          key={page}
          onClick={handleCloseNavMenu}
          sx={{ my: 2, color: 'black', display: 'block' }}>
          {page}
        </Button>
      )),
    [handleCloseNavMenu]
  );

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static" sx={{ backgroundColor: NAVBAR_BACKGROUND_COLOR, color: 'black' }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Box
              sx={{
                display: isMdUp ? 'flex' : 'none',
                mr: 2
              }}>
              <AppLogo />
            </Box>
            <SmallScreenMenu anchorElement={anchorElNav} setAnchorElement={setAnchorElNav} />
            <Box sx={{ flexGrow: 1, display: isXs ? 'flex' : 'none' }}>
              <AppLogo />
            </Box>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>{menuPages}</Box>
            <Box sx={{ flexGrow: 0 }}>
              <UserMenu />
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </ThemeProvider>
  );
}