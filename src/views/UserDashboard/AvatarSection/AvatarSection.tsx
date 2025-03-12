import { Box, Grid, Avatar, Input } from "@mui/material";
import { Add } from "@mui/icons-material";
import { colors } from "../../../theme/colors";
import { useAvatar } from "./useAvatar";
import {
  avatarGridContainer,
  smallAvatarsGrid,
  smallAvatarItem,
  smallAvatarStyle,
  avatarStyle,
} from "./avatarSection.style";

const predefinedAvatars = [
  "/avatars/avatar1.webp",
  "/avatars/avatar2.webp",
  "/avatars/avatar3.webp",
  "/avatars/avatar4.webp",
  "/avatars/avatar5.webp",
  "/avatars/avatar6.webp",
  "/avatars/avatar7.webp",
];

const AvatarSection = () => {
  const { selectedAvatar, updateAvatar, uploadAvatar } = useAvatar();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      uploadAvatar(event.target.files[0]);
    }
  };

  return (
    <Box sx={avatarGridContainer}>
      <Avatar src={selectedAvatar || undefined} sx={avatarStyle} />
      <Grid container spacing={2} sx={smallAvatarsGrid}>
        {predefinedAvatars.map((avatar, index) => (
          <Grid item xs={3} key={index} sx={smallAvatarItem}>
            <Avatar
              src={avatar}
              sx={smallAvatarStyle}
              onClick={() => updateAvatar(avatar)}
            />
          </Grid>
        ))}
        <Grid item xs={3} sx={smallAvatarItem}>
          <Input
            type="file"
            id="upload-avatar"
            sx={{ display: "none" }}
            inputProps={{ accept: "image/*" }}
            onChange={handleFileUpload}
          />
          <label htmlFor="upload-avatar">
            <Avatar
              sx={{
                ...smallAvatarStyle,
                backgroundColor: colors.gold2,
                cursor: "pointer",
              }}
            >
              <Add sx={{ color: colors.textPrimary }} />
            </Avatar>
          </label>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AvatarSection;
