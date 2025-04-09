import { Box, Typography } from "@mui/material";
import { useAuth } from "../../../context/LoginContext/LoginContext";
import { userDataInfoBox } from "./userDataInfo.style";

const UserDataInfo = () => {
  const { userData } = useAuth();
  console.log(userData);

  return (
    <Box>
      <Typography mb={2} variant="h5">
        Your Data
      </Typography>
      <Box sx={userDataInfoBox}>
        <Typography variant="body1">Username: {userData?.username}</Typography>
        <Typography variant="body1">E-mail: {userData?.email}</Typography>
        <Typography variant="body1">Name: {userData?.firstName}</Typography>
        <Typography variant="body1">Surname: {userData?.lastName}</Typography>
      </Box>
    </Box>
  );
};

export default UserDataInfo;
