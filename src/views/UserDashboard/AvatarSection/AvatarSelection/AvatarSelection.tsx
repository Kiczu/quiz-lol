import { Avatar, Box, Grid } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { useAvatar } from "../useAvatar";
import { colors } from "../../../../theme/colors";
import { getMultiColumnGradientSx } from "../../../../utils/gradient";
import {
  afterSX,
  deleteAvatarImg,
  hoverSX,
  smallAvatarImg,
  smallAvatarItem,
  smallAvatarsGrid,
  smallAvatarWrapper,
} from "../avatarSection.style";

type Props = {
  selectedAvatar: string | undefined;
  predefinedAvatars: string[];
  gridColumns: number;
  columns: number;
};

const AvatarSelection = ({
  selectedAvatar,
  predefinedAvatars,
  gridColumns,
  columns,
}: Props) => {
  const { updateAvatar } = useAvatar();

  const handleDeleteAvatar = () => {
    updateAvatar(undefined);
  };

  return (
    <Grid container spacing={4} sx={smallAvatarsGrid}>
      {predefinedAvatars.map((avatar, index) => {
        const colIdx = (index % gridColumns) + 1;
        const gradientFragmentSx = getMultiColumnGradientSx(
          columns,
          colIdx,
          colors.accentGradient
        );
        return (
          <Grid item xs={12 / gridColumns} key={avatar} sx={smallAvatarItem}>
            <Box
              sx={{
                position: "relative",
                ...smallAvatarWrapper,
                ...gradientFragmentSx,
                filter:
                  selectedAvatar === avatar
                    ? "grayscale(0.7) brightness(0.92)"
                    : "none",
                transition: "all 0.2s",
                zIndex: 1,
                "&::after": { ...afterSX, ...gradientFragmentSx },
                "&:hover": hoverSX,
              }}
              onClick={() => updateAvatar(avatar)}
            >
              <Avatar src={avatar} sx={smallAvatarImg} />
            </Box>
          </Grid>
        );
      })}
      <Grid item xs={12 / gridColumns} sx={smallAvatarItem}>
        <Box
          sx={{
            position: "relative",
            ...smallAvatarWrapper,
            ...deleteAvatarImg,
            ...getMultiColumnGradientSx(
              columns,
              columns - 1,
              colors.accentGradient
            ),
            transition: "all 0.2s",
            "&:hover": hoverSX,
          }}
          onClick={handleDeleteAvatar}
        >
          <Delete />
        </Box>
      </Grid>
    </Grid>
  );
};

export default AvatarSelection;
