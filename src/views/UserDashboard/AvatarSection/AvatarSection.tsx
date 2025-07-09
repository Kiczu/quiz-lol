import { Box, Avatar, useMediaQuery, useTheme } from "@mui/material";
import AvatarSelection from "./AvatarSelection/AvatarSelection";
import {
  avatarGridContainer,
  bigAvatarImg,
  bigAvatarWrapper,
} from "./avatarSection.style";
import { useAuth } from "../../../context/LoginContext/LoginContext";
import { getMultiColumnGradientSx } from "../../../utils/gradient";
import { colors } from "../../../theme/colors";

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
  const { userData } = useAuth();
  const selectedAvatar = userData?.avatar;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const gridColumns = isMobile ? 3 : 4;
  const columns = gridColumns + 1;

  return (
    <Box sx={avatarGridContainer}>
      <Box
        sx={{
          ...bigAvatarWrapper,
          ...getMultiColumnGradientSx(columns, 0, colors.accentGradient),
        }}
      >
        <Avatar src={selectedAvatar || undefined} sx={bigAvatarImg} />
      </Box>
      <AvatarSelection
        selectedAvatar={selectedAvatar}
        predefinedAvatars={predefinedAvatars}
        gridColumns={gridColumns}
        columns={columns}
      />
    </Box>
  );
};

export default AvatarSection;
