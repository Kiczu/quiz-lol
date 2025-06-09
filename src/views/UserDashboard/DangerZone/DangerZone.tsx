import { Box, Button, Typography } from "@mui/material";
import { colors } from "../../../theme/colors";

interface Props {
  handleDeleteAccount: () => void;
}

const DangerZone = ({ handleDeleteAccount }: Props) => (
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

export default DangerZone;
