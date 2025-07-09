import { useState } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Menu,
  Container,
  Avatar,
  Tooltip,
  MenuItem,
  Button,
} from "@mui/material";
import { Link } from "react-router-dom";
import MobileNav from "./MobileNav/MobileNav";
import DesktopNav from "./DesktopNav/DesktopNav";
import { useAuth } from "../../context/LoginContext/LoginContext";
import { paths } from "../../paths";
import {
  userSettingsContainer,
  navigationContainer,
  menuItem,
  avatarIcon,
} from "./navigation.style";

const pages = [
  {
    name: "Home",
    href: paths.HOME,
  },
  {
    name: "Ranking",
    href: paths.RANKING,
  },
  {
    name: "Lore",
    href: paths.LORE,
  },
];

const settings = [
  {
    name: "Dashboard",
    href: paths.DASHBOARD,
  },
];

const settingsNotLoggedIn = [
  {
    name: "Login",
    href: paths.LOGIN,
  },
  {
    name: "Register",
    href: paths.REGISTER,
  },
];

const Navigation = () => {
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const { userData, handleSignOut } = useAuth();

  const handleOpenUserMenu = (e: React.MouseEvent<HTMLElement>) =>
    setAnchorElUser(e.currentTarget);

  const handleOpenNavMenu = (e: React.MouseEvent<HTMLElement>) =>
    setAnchorElNav(e.currentTarget);

  const handleCloseNavMenu = () => setAnchorElNav(null);

  const handleCloseUserMenu = () => setAnchorElUser(null);

  const visibleSetting = userData ? settings : settingsNotLoggedIn;

  return (
    <AppBar
      position="sticky"
      className="app-bar"
      elevation={0}
      sx={navigationContainer}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <MobileNav
            pages={pages}
            handleCloseNavMenu={handleCloseNavMenu}
            handleCloseUserMenu={handleCloseUserMenu}
            handleOpenNavMenu={handleOpenNavMenu}
            anchorElNav={anchorElNav}
          />
          <DesktopNav pages={pages} handleCloseNavMenu={handleCloseNavMenu} />
          <Box>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar
                  alt="avatar"
                  src={userData?.avatar || "/default-avatar.png"}
                  sx={avatarIcon}
                />
              </IconButton>
            </Tooltip>
            <Menu
              sx={userSettingsContainer}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {visibleSetting.map((setting) => (
                <Link to={setting.href} key={setting.name}>
                  <MenuItem onClick={handleCloseUserMenu} sx={menuItem}>
                    <Button>{setting.name}</Button>
                  </MenuItem>
                </Link>
              ))}

              {userData && (
                <MenuItem onClick={handleSignOut} sx={menuItem}>
                  <Button>Wyloguj się</Button>
                </MenuItem>
              )}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default Navigation;
