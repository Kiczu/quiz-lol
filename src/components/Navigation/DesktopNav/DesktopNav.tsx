import { Box, Button, Link } from "@mui/material";
import { Link as ReactRouter } from "react-router-dom";
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
      <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
        {pages.map((page) => (
          <Button
            key={page.name}
            onClick={handleCloseNavMenu}
            sx={{
              color: "white",
              fontFamily: "'BeaufortforLOL', Arial, sans-serif",
              fontWeight: 700,
              px: 3,
              letterSpacing: 2,
              fontSize: "1rem",
              borderBottom: "2px solid transparent",
              transition: "color 0.15s, border-bottom 0.17s",
              "&:hover": {
                color: "#C8AA6E",
                borderBottom: "2.5px solid #C8AA6E",
                background: "none",
              },
            }}
          >
            <Link component={ReactRouter} to={page.href} underline="none" >
              {page.name}
            </Link>
          </Button>
        ))}
      </Box>
    </>
  );
};

export default DesktopNav;
