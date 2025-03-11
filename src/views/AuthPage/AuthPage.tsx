import { useLocation, Outlet } from "react-router-dom";
import { Button, Grid, Paper, Typography } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/LoginContext/LoginContext";
import { animationConfig, authPageStyles } from "./authPage.style";

const AuthPage = () => {
  const location = useLocation();
  const { handleSignInWithGoogle } = useAuth();

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
