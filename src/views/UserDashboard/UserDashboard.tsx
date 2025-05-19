import { Box, Grid, Typography, Container } from "@mui/material";
import { useUserProfile } from "./useUserProfile";
import { useScores } from "./ScoresSection/useScores";
import AvatarSection from "./AvatarSection/AvatarSection";
import ScoresSection from "./ScoresSection/ScoresSection";
import EditUserForm from "./EditUserForm/EditUserForm";
import ChangePasswordForm from "./ChangePasswordForm/ChangePasswordForm";
import UserDataInfo from "./UserDataInfo/UserDataInfo";
import DangerZone from "./DangerZone/DangerZone";
import { useAuth } from "../../context/LoginContext/LoginContext";
import {
  dashboardViewContainer,
  dataFormsContainer,
} from "./userDashboard.style";

const UserDashboard = () => {
  const { userData } = useAuth();
  const { formData, updateUserProfile, isUsernameEditable } = useUserProfile();
  const { scores } = useScores(userData?.uid);

  return (
    <Box sx={dashboardViewContainer}>
      <Container maxWidth="xl">
        <AvatarSection />
        <ScoresSection scores={scores} />
        <Grid container spacing={10} mt={0}>
          <Grid item sm={12} md={8} sx={dataFormsContainer}>
            <Typography variant="h5">Edit Your Data</Typography>
            <EditUserForm
              formData={formData}
              isUsernameEditable={isUsernameEditable}
              onSubmit={updateUserProfile}
            />
            <ChangePasswordForm />
          </Grid>
          <Grid item sm={12} md={4}>
            <UserDataInfo />
            <DangerZone />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default UserDashboard;
