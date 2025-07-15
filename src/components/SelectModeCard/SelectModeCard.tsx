import { Box, Typography, Link } from "@mui/material";

import {
  modeImg,
  modeTitle,
  modeDesc,
  linkCardContainer,
  modeCard,
  getModeCardWrapperSx,
} from "./selectModeCard.style";

type Props = {
  title: string;
  desc: string;
  link: string;
  img: string;
  idx: number;
  columns: number;
};

const SelectModeCard = ({ title, desc, link, img, idx, columns }: Props) => (
  <Link href={link} underline="none" sx={linkCardContainer}>
    <Box sx={getModeCardWrapperSx(columns, idx, 2)}>
      <Box sx={modeCard}>
        <Box component="img" src={img} alt={title} sx={modeImg} />
        <Typography component="h3" sx={modeTitle}>
          {title}
        </Typography>
        <Typography sx={modeDesc}>{desc}</Typography>
      </Box>
    </Box>
  </Link>
);

export default SelectModeCard;
