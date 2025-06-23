import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Grid, Typography, Container } from "@mui/material";
import { useScores } from "./ScoresSection/useScores";
import AvatarSection from "./AvatarSection/AvatarSection";
import ScoresSection from "./ScoresSection/ScoresSection";
import EditUserForm from "./EditUserForm/EditUserForm";
import ChangePasswordForm from "./ChangePasswordForm/ChangePasswordForm";
import UserDataInfo from "./UserDataInfo/UserDataInfo";
import DangerZone from "./DangerZone/DangerZone";
import { useAuth } from "../../context/LoginContext/LoginContext";
import { useModal } from "../../context/ModalContext/ModalContext";
import { userAggregateService } from "../../services/userAggregateService";
import { paths } from "../../paths";
import {
  dashboardViewContainer,
  dataFormsContainer,
} from "./userDashboard.style";
import { authService } from "../../services/authService";
import { deleteUser } from "firebase/auth";
import { getErrorMessage } from "../../utils/errorUtils";

const UserDashboard = () => {
  const navigate = useNavigate();
  const { userData, handleSignOut, isLoading } = useAuth();
  const { showModal, showErrorModal } = useModal();
  const { scores, totalScore } = useScores(userData?.uid);

  useEffect(() => {
    if (!isLoading && !userData) {
      navigate(paths.LOGIN);
      return;
    }
    if (userData && !userData.username) {
      showModal({
        title: "Username Required",
        content: <EditUserForm />,
        actions: null,
        variant: "warning",
        onlyConfirm: false,
        disableClose: true,
      });
    }
  }, [userData, isLoading, navigate, showModal]);

  const handleDeleteAccount = async () => {
    if (!userData?.uid) return;
    showModal({
      title: "Are you sure?",
      content: "This action cannot be undone. Do you want to proceed?",
      variant: "warning",
      onlyConfirm: false,
      onConfirm: async () => {
        try {
          await userAggregateService.deleteUserData(userData.uid);
          const user = authService.getCurrentUser();
          if (user) {
            await deleteUser(user);
          }
          await handleSignOut();
          showModal({
            title: "Account deleted",
            content: "Your account has been deleted successfully.",
            variant: "success",
            onConfirm: () => navigate(paths.LOGIN),
          });
        } catch (error: unknown) {
          showErrorModal(getErrorMessage(error));
        }
      },
    });
  };

  return (
    <Box sx={dashboardViewContainer}>
      <Container maxWidth="xl">
        <AvatarSection />
        <ScoresSection scores={scores} totalScore={totalScore} />
        <Grid container spacing={10} mt={0}>
          <Grid item sm={12} md={8} sx={dataFormsContainer}>
            <Typography variant="h5">Edit Your Data</Typography>
            {userData?.username && <EditUserForm />}
            <ChangePasswordForm />
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
