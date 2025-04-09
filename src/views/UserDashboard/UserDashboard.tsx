import { Box, Grid, Typography, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useUserProfile } from "./useUserFormData";
import { useScores } from "./ScoresSection/useScores";
import AvatarSection from "./AvatarSection/AvatarSection";
import ScoresSection from "./ScoresSection/ScoresSection";
import EditUserForm from "./EditUserForm/EditUserForm";
import ChangePasswordForm from "./ChangePasswordForm/CahngePasswordForm";
import UserDataInfo from "./UserDataInfo/UserDataInfo";
import DangerZone from "./DangerZone/DangerZone";
import { useAuth } from "../../context/LoginContext/LoginContext";
import { userService } from "../../services/userService";
import { paths } from "../../paths";
import {
  dashboardViewContainer,
  dataFormsContainer,
} from "./userDashboard.style";

const UserDashboard = () => {
  const navigate = useNavigate();
  const { userData } = useAuth();
  const { formData, updateUserProfile, isUsernameEditable } = useUserProfile();
  const { scores } = useScores(userData?.uid);

  const handleDeleteAccount = async () => {
    if (!userData?.uid) return;

    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      try {
        await userService.deleteUser(userData.uid);
        alert("Account deleted successfully.");
        navigate(paths.LOGIN);
      } catch (error) {
        console.error("Error deleting account:", error);
        alert("Failed to delete account.");
      }
    }
  };

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
            <ChangePasswordForm
              handlePasswordChange={userService.handlePasswordChange}
            />
          </Grid>
          <Grid item sm={12} md={4}>
            <UserDataInfo />
            <DangerZone handleDeleteAccount={handleDeleteAccount} />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default UserDashboard;
