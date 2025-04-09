import { Box, Avatar } from "@mui/material";
import { useAvatar } from "./useAvatar";
import AvatarSelection from "./AvatarSelection/AvatarSelection";
import { avatarGridContainer, avatarStyle } from "./avatarSection.style";

const AvatarSection = () => {
  const { selectedAvatar } = useAvatar();

  return (
    <Box sx={avatarGridContainer}>
      <Avatar src={selectedAvatar || undefined} sx={avatarStyle} />
      <AvatarSelection />
    </Box>
  );
};

export default AvatarSection;
