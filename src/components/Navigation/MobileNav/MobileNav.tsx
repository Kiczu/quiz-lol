import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Link,
} from "@mui/material";
import { GiHamburgerMenu } from "react-icons/gi";
import { Link as ReactRouter } from "react-router-dom";
import logoQuiz from "../../../assets/images/logo-quiz2.png";

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
          color="inherit"
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
          sx={{
            display: { xs: "block", md: "none" },
          }}
        >
          {pages.map((page) => (
            <Link component={ReactRouter} to={page.href} key={page.name}>
              <MenuItem onClick={handleCloseUserMenu}>
                <Typography textAlign="center">{page.name}</Typography>
              </MenuItem>
            </Link>
          ))}
        </Menu>
      </Box>
      <Box
        component="img"
        alt="Logo"
        src={logoQuiz}
        sx={{
          maxWidth: 80,
          width: "100%",
          display: { xs: "flex", md: "none" },
          flexGrow: 1,
          margin: "auto",
        }}
      />
    </>
  );
};

export default MobileNav;
