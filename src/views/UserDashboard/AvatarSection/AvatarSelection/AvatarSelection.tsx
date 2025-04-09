import { Avatar, Grid, Input } from "@mui/material";
import {
  smallAvatarItem,
  smallAvatarsGrid,
  smallAvatarStyle,
} from "../avatarSection.style";
import { useAvatar } from "../useAvatar";
import { colors } from "../../../../theme/colors";
import { Add } from "@mui/icons-material";

const predefinedAvatars = [
  "/avatars/avatar1.webp",
  "/avatars/avatar2.webp",
  "/avatars/avatar3.webp",
  "/avatars/avatar4.webp",
  "/avatars/avatar5.webp",
  "/avatars/avatar6.webp",
  "/avatars/avatar7.webp",
];

const AvatarSelection = () => {
  const { updateAvatar, uploadAvatar } = useAvatar();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      uploadAvatar(event.target.files[0]);
    }
  };

  return (
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
  );
};

export default AvatarSelection;
