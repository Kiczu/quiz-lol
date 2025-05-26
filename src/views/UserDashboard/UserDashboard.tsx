import { useEffect, useState } from "react";
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
import { userService } from "../../services/userService";
import { paths } from "../../paths";
import {
  dashboardViewContainer,
  dataFormsContainer,
} from "./userDashboard.style";

const UserDashboard = () => {
  const [modalShown, setModalShown] = useState(false);
  const navigate = useNavigate();
  const { userData } = useAuth();
  const { showModal } = useModal();
  const { scores } = useScores(userData?.uid);

  useEffect(() => {
    if (!userData) {
      navigate(paths.LOGIN);
      return;
    }
    if (userData && !userData.username && !modalShown) {
      showModal({
        title: "Username Required",
        content: <EditUserForm />,
        variant: "warning",
        disableClose: true,
      });
      setModalShown(true);
    }
  }, [userData, navigate, showModal, modalShown]);

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
