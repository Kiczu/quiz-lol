import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Grid, Typography, Container } from "@mui/material";
import { useScores } from "./ScoresSection/useScores";
import AvatarSection from "./AvatarSection/AvatarSection";
import ScoresSection from "./ScoresSection/ScoresSection";
import EditUserForm from "./EditUserForm/EditUserForm";
import UserDataInfo from "./UserDataInfo/UserDataInfo";
import DangerZone from "./DangerZone/DangerZone";
import { useAuth } from "../../context/LoginContext/LoginContext";
import { useModal } from "../../context/ModalContext/ModalContext";
import { useBackground } from "../../context/BackgroundContext/BackgroundContext";
import { authService } from "../../services/authService";
import { deleteAccountWithAuth } from "../../helpers/deleteAccountWithAuth";
import { getErrorMessage, isFirebaseCode } from "../../utils/errorUtils";
import ReauthPasswordForm from "../../components/ReauthPasswordForm/ReauthPasswordForm";
import { paths } from "../../paths";
import {
  dashboardOverlay,
  dashboardViewContainer,
  dataFormsContainer,
  glassPanel,
  scoresContainer,
} from "./userDashboard.style";
import PasswordSection from "./PasswordSection/PasswordSection";
import backgroundMap from "../../assets/images/backgroundMap.jpg";

const UserDashboard = () => {
  const navigate = useNavigate();
  const {
    userData,
    handleSignOut,
    isLoading,
    refreshUserData,
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
            refreshUserData={refreshUserData}
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
    refreshUserData,
  ]);

  const handleDeleteAccount = async () => {
    if (!userData?.uid) return;
    showModal({
      title: "Are you sure?",
      content: "This action cannot be undone. Do you want to proceed?",
      variant: "warning",
      onlyConfirm: false,
      onConfirm: async () => {
        const user = authService.getCurrentUser();
        if (!user) return;

        try {
          await deleteAccountWithAuth();
          await handleSignOut();
          showModal({
            title: "Account deleted",
            content: "Your account has been deleted successfully.",
            variant: "success",
            onConfirm: () => navigate(paths.LOGIN),
          });
        } catch (error) {
          if (isFirebaseCode(error, "auth/requires-recent-login")) {
            const providerId = user?.providerData[0]?.providerId;
            if (providerId === "password") {
              showModal({
                title: "Reauthenticate",
                content: (
                  <ReauthPasswordForm
                    onSubmit={async (password) => {
                      try {
                        await deleteAccountWithAuth(password);
                        await handleSignOut();
                        showModal({
                          title: "Account deleted",
                          content:
                            "Your account has been deleted successfully.",
                          variant: "success",
                          onConfirm: () => navigate(paths.LOGIN),
                        });
                      } catch (reauthError) {
                        showModal({
                          title: "Error",
                          content: getErrorMessage(reauthError),
                          variant: "error",
                        });
                      }
                    }}
                  />
                ),
                variant: "warning",
                disableClose: true,
              });
            } else if (providerId === "google.com") {
              try {
                await authService.reauthenticateUser();
                await deleteAccountWithAuth();
                await handleSignOut();
                showModal({
                  title: "Account deleted",
                  content: "Your account has been deleted successfully.",
                  variant: "success",
                  onConfirm: () => navigate(paths.LOGIN),
                });
              } catch (reauthError) {
                showModal({
                  title: "Error",
                  content: getErrorMessage(reauthError),
                  variant: "error",
                });
              }
            }
          } else {
            showModal({
              title: "Error",
              content: getErrorMessage(error),
              variant: "error",
            });
          }
        }
      },
    });
  };

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
                  refreshUserData={refreshUserData}
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
