import { Box, Link, Typography } from "@mui/material";
import { Link as ReactRouter } from "react-router-dom";

import {
  comingSoonBadge,
  disabledCardContainer,
  getModeCardWrapperSx,
  linkCardContainer,
  modeCard,
  modeCardDisabled,
  modeDesc,
  modeImg,
  modeTitle,
} from "./selectModeCard.style";

type Props = {
  title: string;
  desc: string;
  img: string;
  idx: number;
  columns: number;
  link?: string;
};

const SelectModeCard = ({ title, desc, img, idx, columns, link }: Props) => {
  const comingSoon = !link;

  const card = (
    <Box sx={getModeCardWrapperSx(columns, idx, 2)}>
      <Box sx={comingSoon ? { ...modeCard, ...modeCardDisabled } : modeCard}>
        {comingSoon && (
          <Typography component="span" sx={comingSoonBadge}>
            Coming soon
          </Typography>
        )}
        <Box component="img" src={img} alt={title} sx={modeImg} />
        <Typography component="h3" sx={modeTitle}>
          {title}
        </Typography>
        <Typography sx={modeDesc}>{desc}</Typography>
      </Box>
    </Box>
  );

  if (comingSoon) {
    return (
      <Box sx={disabledCardContainer} aria-disabled="true">
        {card}
      </Box>
    );
  }

  return (
    <Link
      component={ReactRouter}
      to={link}
      underline="none"
      sx={linkCardContainer}
    >
      {card}
    </Link>
  );
};

export default SelectModeCard;
