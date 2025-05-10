import { useNavigate } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";
import { paths } from "../../../paths";
import { useAuth } from "../../../context/LoginContext/LoginContext";
import { userService } from "../../../services/userService";
import { colors } from "../../../theme/colors";

const DangerZone = () => {
  const navigate = useNavigate();
  const { userData } = useAuth();
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
    <Box>
      <Typography variant="h5" mb={2} mt={2} sx={{ color: colors.gold2 }}>
        Danger Zone
      </Typography>
      <Typography variant="body1" mb={2}>
        Once you delete your account, there is no going back. Please be certain.
      </Typography>
      <Button variant="contained" color="error" onClick={handleDeleteAccount}>
        Delete Account
      </Button>
    </Box>
  );
};

export default DangerZone;
