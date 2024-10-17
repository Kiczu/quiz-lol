import {
  Box,
  Grid,
  Avatar,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Container,
} from "@mui/material";
import { colors } from "../../theme/colors";

const UserDashboard = () => {
  return (
    <Box
      sx={{
        backgroundColor: colors.background,
        color: colors.textPrimary,
        minHeight: "100vh",
        p: 4,
      }}
    >
      <Container maxWidth="xl">
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
          <Avatar
            sx={{ width: 120, height: 120, backgroundColor: colors.blue2 }}
          >
            A
          </Avatar>
          <Grid container spacing={2} sx={{ width: "50%" }}>
            {[...Array(8)].map((_, index) => (
              <Grid item xs={3} key={index}>
                <Avatar
                  sx={{ width: 60, height: 60, backgroundColor: colors.blue1 }}
                >
                  A{index + 1}
                </Avatar>
              </Grid>
            ))}
          </Grid>
        </Box>
        <Grid container spacing={4}>
          {[...Array(4)].map((_, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  backgroundColor: colors.backgroundSecondary,
                  color: colors.textPrimary,
                }}
              >
                <CardContent>
                  <Typography variant="h6">Score {index + 1}</Typography>
                  <Typography variant="body1">Score details...</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ backgroundColor: colors.gold3, color: colors.primary }}>
              <CardContent>
                <Typography variant="h6">Total Score</Typography>
                <Typography variant="body1">12345</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Box sx={{ mt: 4, display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ width: "65%" }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              Edit Your Information
            </Typography>
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                label="First Name"
                variant="outlined"
                sx={{
                  mb: 2,
                  backgroundColor: colors.backgroundSecondary,
                  color: colors.textPrimary,
                }}
              />
              <TextField
                fullWidth
                label="Last Name"
                variant="outlined"
                sx={{
                  mb: 2,
                  backgroundColor: colors.backgroundSecondary,
                  color: colors.textPrimary,
                }}
              />
            </Box>
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                sx={{
                  mb: 2,
                  backgroundColor: colors.backgroundSecondary,
                  color: colors.textPrimary,
                }}
              />
            </Box>
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                label="New Password"
                type="password"
                variant="outlined"
                sx={{
                  mb: 2,
                  backgroundColor: colors.backgroundSecondary,
                  color: colors.textPrimary,
                }}
              />
              <TextField
                fullWidth
                label="Confirm New Password"
                type="password"
                variant="outlined"
                sx={{
                  mb: 2,
                  backgroundColor: colors.backgroundSecondary,
                  color: colors.textPrimary,
                }}
              />
            </Box>
            <Button variant="contained">Save Changes</Button>
          </Box>
          <Box sx={{ width: "30%" }}>
            <Typography variant="h5" sx={{ mb: 2, color: colors.gold2 }}>
              Danger Zone
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Once you delete your account, there is no going back. Please be
              certain.
            </Typography>
            <Button variant="contained">Delete Account</Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default UserDashboard;
