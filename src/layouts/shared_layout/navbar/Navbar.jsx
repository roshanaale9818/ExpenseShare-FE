import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { PAGES, SETTINGS_MENU } from 'src/utils/menu/pages';

// import { authActions } from 'src/store';
import { authActions } from 'src/store';

import ConfirmDialog from 'src/components/confirm/confirm-dialog';

// import AdbIcon from '@mui/icons-material/Adb';

export default function Navbar() {
  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.auth);
  // const dispatch = useDispatch();
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = (route) => {
    setAnchorElNav(null);
  };
  const onCanceledHandler = () => {};
  const onConfirmHandler = () => {
    dispatch(authActions.logout());
    navigate('/home');
  };

  const handleCloseUserMenu = (menu) => {
    setAnchorElUser(null);
    try {
      navigate(menu.url);
    } catch {
      console.error('errror has occured');
    }
  };
  // const logoutHandler = async () => {
  //   await dispatch(authActions.logout());
  //   navigate('/home');
  // };
  const onNavbarMainHandler = () => {
    console.log('This should route to main home');
  };
  const navigate = useNavigate();
  const onNavitemClicked = (route) => {
    setAnchorElNav(null);
    navigate(route.url);
  };

  return (
    <AppBar position="static" style={{ backgroundColor: '#2E3B55', padding: '7px' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="a"
            onClick={onNavbarMainHandler}
            sx={{
              mr: 18,
              display: { xs: 'none', md: 'flex' },
              fontFamily: '',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
              cursor: 'pointer',
            }}
          >
            ExpenseShare
          </Typography>

          {/* //small screen navigation */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              {/* //bread crumb for small screen  */}
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {PAGES.map((page) => (
                <MenuItem
                  key={page.name}
                  onClick={() => {
                    onNavitemClicked(page);
                  }}
                >
                  <Typography textAlign="center"> {page.name}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, width: 100 }}>
            {PAGES.map((page) => (
              <Button
                key={page.name}
                onClick={() => {
                  onNavitemClicked(page);
                }}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page.name}
              </Button>
            ))}
          </Box>

          {authUser.isLoggedIn && (
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Profile">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                </IconButton>
              </Tooltip>

              <Menu
                sx={{ mt: '45px', width: '200px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <div style={{ width: '200px' }}>
                  {SETTINGS_MENU.map((setting) => (
                    <MenuItem
                      key={setting.title}
                      onClick={() => {
                        handleCloseUserMenu(setting);
                      }}
                    >
                      <Typography textAlign="right">{setting.title}</Typography>
                    </MenuItem>
                  ))}
                  <ConfirmDialog
                    title="Are you sure you want to Logout ?"
                    description="You have to sign in again."
                    onConfirmed={onConfirmHandler}
                    onCanceled={onCanceledHandler}
                    label="Logout"
                    sx={{
                      typography: 'body2',
                      textAlign: 'left',
                      color: 'error.main',
                      py: 1,
                      width: '90%',
                    }}
                  />
                </div>
              </Menu>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
