import { Box, Avatar } from "@mui/material";
import AvatarSelection from "./AvatarSelection/AvatarSelection";
import { avatarGridContainer, avatarStyle } from "./avatarSection.style";
import { useAuth } from "../../../context/LoginContext/LoginContext";

const AvatarSection = () => {
  const { userData } = useAuth();
  const selectedAvatar = userData?.avatar;

  return (
    <Box sx={avatarGridContainer}>
      <Avatar src={selectedAvatar || undefined} sx={avatarStyle} />
      <AvatarSelection />
    </Box>
  );
};

export default AvatarSection;
