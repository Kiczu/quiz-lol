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
            sx={{ my: 2, color: "white", display: "block" }}
          >
            <Link component={ReactRouter} to={page.href}>
              {page.name}
            </Link>
          </Button>
        ))}
      </Box>
    </>
  );
};

export default DesktopNav;
