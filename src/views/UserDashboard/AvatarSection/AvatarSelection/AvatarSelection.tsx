import { Avatar, Box, Grid } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { useAvatar } from "../useAvatar";
import { colors } from "../../../../theme/colors";
import { getMultiColumnGradientSx } from "../../../../utils/gradient";
import {
  deleteAvatarImg,
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
    console.log("usun avatar");
    updateAvatar("");
  };

  return (
    <Grid container spacing={2} sx={smallAvatarsGrid}>
      {predefinedAvatars.map((avatar, index) => {
        const colIdx = (index % gridColumns) + 1;
        return (
          <Grid item xs={12 / gridColumns} key={avatar} sx={smallAvatarItem}>
            <Box
              sx={{
                ...smallAvatarWrapper,
                ...getMultiColumnGradientSx(
                  columns,
                  colIdx,
                  colors.accentGradient
                ),
                filter:
                  selectedAvatar === avatar
                    ? "grayscale(0.7) brightness(0.92)"
                    : "none",
                opacity: selectedAvatar === avatar ? 0.68 : 1,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onClick={() => updateAvatar(avatar)}
            >
              <Avatar
                src={avatar}
                sx={smallAvatarImg}
                onClick={() => handleDeleteAvatar}
              />
            </Box>
          </Grid>
        );
      })}
      <Grid item xs={12 / gridColumns} sx={smallAvatarItem}>
        <Box
          sx={{
            ...smallAvatarWrapper,
            ...deleteAvatarImg,
            ...getMultiColumnGradientSx(
              columns,
              columns - 1,
              colors.accentGradient
            ),
          }}
          onClick={() => updateAvatar(undefined)}
          title="Usuń avatar (domyślny)"
        >
          <Delete />
        </Box>
      </Grid>
    </Grid>
  );
};

export default AvatarSelection;
