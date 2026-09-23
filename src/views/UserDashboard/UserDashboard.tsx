import { Box, Grid, Typography, Container } from "@mui/material";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import backgroundMap from "../../assets/images/backgroundMap.webp";
import { useBackground } from "../../context/BackgroundContext/BackgroundContext";
import { useAuth } from "../../context/LoginContext/LoginContext";
import { useModal } from "../../context/ModalContext/ModalContext";
import { paths } from "../../paths";

import AvatarSection from "./AvatarSection/AvatarSection";
import DangerZone from "./DangerZone/DangerZone";
import EditUserForm from "./EditUserForm/EditUserForm";
import PasswordSection from "./PasswordSection/PasswordSection";
import ScoresSection from "./ScoresSection/ScoresSection";
import { useScores } from "./ScoresSection/useScores";
import useDeleteAccount from "./useDeleteAccount";
import {
  dashboardOverlay,
  dashboardViewContainer,
  dataFormsContainer,
  glassPanel,
  scoresContainer,
} from "./userDashboard.style";
import UserDataInfo from "./UserDataInfo/UserDataInfo";


const UserDashboard = () => {
  const navigate = useNavigate();
  const {
    userData,
    isLoading,
    updateUserData,
  } = useAuth();
  const { showModal } = useModal();
  const { scores, totalScore } = useScores(userData?.uid);
  const { setImage } = useBackground();

  useEffect(() => {
    setImage(backgroundMap);
    return () => setImage(undefined);
  }, [setImage]);

  useEffect(() => {
    if (!isLoading && !userData) {
      navigate(paths.LOGIN);
      return;
    }
    if (!isLoading && userData && !userData.username) {
      showModal({
        title: "Username Required",
        content: (
          <EditUserForm
            userData={userData}
            updateUserData={updateUserData}
          />
        ),
        actions: null,
        variant: "warning",
        onlyConfirm: false,
        disableClose: true,
      });
    }
  }, [
    userData,
    isLoading,
    navigate,
    showModal,
    updateUserData,
  ]);

  const handleDeleteAccount = useDeleteAccount();

  return (
    <Box sx={dashboardViewContainer}>
      <Box sx={dashboardOverlay}>
        <Container maxWidth="xl" sx={{ p: 4 }}>
          <Box mt={2}>
            <AvatarSection />
          </Box>
          <Box mt={10} sx={scoresContainer}>
            <ScoresSection scores={scores} totalScore={totalScore} />
          </Box>
          <Grid container spacing={10} mt={0}>
            <Grid item sm={12} md={8} sx={dataFormsContainer}>
              <Typography variant="h3">Edit Your Data</Typography>
              {userData?.username && (
                <EditUserForm
                  userData={userData}
                  updateUserData={updateUserData}
                />
              )}
              <PasswordSection />
            </Grid>
            <Grid item sm={12} md={4}>
              <Typography variant="h3">Your Data:</Typography>
              <Box sx={glassPanel} mt={4}>
                <UserDataInfo />
              </Box>
              <Typography variant="h3" mb={2} mt={2}>
                Danger Zone
              </Typography>
              <Box sx={glassPanel} mt={4}>
                <DangerZone handleDeleteAccount={handleDeleteAccount} />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default UserDashboard;
