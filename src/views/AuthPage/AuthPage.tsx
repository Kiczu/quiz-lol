import { Button, Grid, Paper, Typography } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { useLocation, useNavigate, Outlet } from "react-router-dom";

import { useAuth } from "../../context/LoginContext/LoginContext";
import { paths } from "../../paths";

import { animationConfig, authPageStyles } from "./authPage.style";

const AuthPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userData, handleSignInWithGoogle } = useAuth();

  useEffect(() => {
    if (userData && location.pathname === paths.LOGIN) {
      navigate("/dashboard", { replace: true });
    }
  }, [userData, location.pathname, navigate]);

  return (
    <Grid container component="main" sx={authPageStyles.container}>
      <Grid item xs={false} sm={4} md={7} />
      <Grid
        item
        xs={12}
        sm={8}
        md={5}
        p={8}
        component={Paper}
        square
        sx={authPageStyles.authBox}
      >
        <AnimatePresence mode="wait">
          <motion.div key={location.pathname} {...animationConfig}>
            <Outlet />
            <Typography m={2} mx={0}>
              Or login with:
            </Typography>
            <Button variant="outlined" onClick={handleSignInWithGoogle}>
              Google
            </Button>
          </motion.div>
        </AnimatePresence>
      </Grid>
    </Grid>
  );
};

export default AuthPage;
