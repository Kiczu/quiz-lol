import { Box, Typography, Link } from "@mui/material";
import {
  modeCard,
  modeImg,
  modeTitle,
  modeDesc,
  linkCardContainer,
} from "./selectModeCardStyle";

type Props = {
  title: string;
  desc: string;
  link: string;
  img: string;
};

const SelectModeCard = ({ title, desc, link, img }: Props) => {
  return (
    <Link href={link} underline="none" sx={linkCardContainer}>
      <Box sx={modeCard}>
        <Box component="img" src={img} alt={title} sx={modeImg} />
        <Typography component="h3" sx={modeTitle}>
          {title}
        </Typography>
        <Typography sx={modeDesc}>{desc}</Typography>
      </Box>
    </Link>
  );
};

export default SelectModeCard;
