import { Box, Button, Typography } from "@mui/material";

interface Props {
  handleDeleteAccount: () => void;
}

const DangerZone = ({ handleDeleteAccount }: Props) => (
  <Box>
    <Typography variant="body1" mb={2}>
      Once you delete your account, there is no going back. Please be certain.
    </Typography>
    <Button variant="contained" color="error" onClick={handleDeleteAccount}>
      Delete Account
    </Button>
  </Box>
);

export default DangerZone;
