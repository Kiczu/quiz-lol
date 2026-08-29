import { Box, CircularProgress } from "@mui/material";
import { Navigate } from "react-router-dom";

import { useAuth } from "../../context/LoginContext/LoginContext";
import { paths } from "../../paths";

import { authCheckWrapper, authCheckLoader } from "./requireAuth.style";

type Props = {
  children: React.ReactNode;
};

const RequireAuth = ({ children }: Props) => {
  const { userData, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Box sx={authCheckWrapper}>
        <CircularProgress sx={authCheckLoader} />
      </Box>
    );
  }

  if (!userData) {
    return <Navigate to={paths.LOGIN} replace />;
  }

  return <>{children}</>;
};

export default RequireAuth;
