import { Box, Button, Link } from "@mui/material";
import { Link as ReactRouter } from "react-router-dom";
import { desktopNavPages, desktopNavPagesContainer } from "../navigation.style";
import logoQuiz from "../../../assets/images/logo-quiz2.png";

interface DesktopNavProps {
  pages: {
    name: string;
    href: string;
  }[];
  handleCloseNavMenu: () => void;
}
const DesktopNav = ({ pages, handleCloseNavMenu }: DesktopNavProps) => {
  return (
    <>
      <Box
        component="img"
        alt="Logo"
        src={logoQuiz}
        sx={{
          maxWidth: 80,
          width: "90%",
          mr: 2,
          p: 1,
          display: { xs: "none", md: "flex" },
        }}
      />
      <Box sx={desktopNavPagesContainer}>
        {pages.map((page, index) => (
          <Link
            component={ReactRouter}
            to={page.href}
            key={index}
            underline="none"
          >
            <Button
              key={page.name}
              onClick={handleCloseNavMenu}
              sx={desktopNavPages}
            >
              {page.name}
            </Button>
          </Link>
        ))}
      </Box>
    </>
  );
};

export default DesktopNav;
