import { Box, Link, Typography } from "@mui/material";
import { Link as ReactRouter } from "react-router-dom";

import { paths } from "../../paths";

import { footerContainer, footerDisclaimer, footerLink } from "./footer.style";

const Footer = () => (
  <Box component="footer" sx={footerContainer}>
    <Typography sx={footerDisclaimer}>
      Queue Quiz was created under Riot Games' "Legal Jibber Jabber" policy
      using assets owned by Riot Games. Riot Games does not endorse or sponsor
      this project.
    </Typography>
    <Link component={ReactRouter} to={paths.PRIVACY} sx={footerLink}>
      Privacy Policy
    </Link>
  </Box>
);

export default Footer;
