import { Box, IconButton, Menu, MenuItem, Button } from "@mui/material";
import { GiHamburgerMenu } from "react-icons/gi";
import { Link } from "react-router-dom";

import logoQuiz from "../../../assets/images/QueueQuizLogo.svg";
import { colors } from "../../../theme/colors";
import {
  logoNav,
  menuItem,
  mobileNavPagesContainer,
} from "../navigation.style";

interface MobileNavProps {
  pages: {
    name: string;
    href: string;
  }[];
  handleCloseNavMenu: () => void;
  handleCloseUserMenu: () => void;
  handleOpenNavMenu: (event: React.MouseEvent<HTMLElement>) => void;
  anchorElNav: null | HTMLElement;
}

const MobileNav = ({
  pages,
  handleCloseNavMenu,
  anchorElNav,
  handleCloseUserMenu,
  handleOpenNavMenu,
}: MobileNavProps) => {
  return (
    <>
      <Box
        sx={{ maxWidth: 50, flexGrow: 1, display: { xs: "flex", md: "none" } }}
      >
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleOpenNavMenu}
          sx={{ color: colors.gold2 }}
        >
          <GiHamburgerMenu />
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={anchorElNav}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          open={Boolean(anchorElNav)}
          onClose={handleCloseNavMenu}
          sx={mobileNavPagesContainer}
        >
          {pages.map((page) => (
            <Link to={page.href} key={page.name}>
              <MenuItem onClick={handleCloseUserMenu} sx={menuItem}>
                <Button>{page.name}</Button>
              </MenuItem>
            </Link>
          ))}
        </Menu>
      </Box>
      <Box component="img" alt="Logo" src={logoQuiz} sx={logoNav} />
    </>
  );
};

export default MobileNav;
