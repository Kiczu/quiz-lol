import { Box, Grid, Typography } from "@mui/material";

import { ChampionOption } from "../../../services/gameRoundService";

import {
  getOptionWrapperSx,
  optionCard,
  optionIcon,
  optionName,
} from "./championOptions.style";

type Props = {
  options: ChampionOption[];
  usedChampions: string[];
  columns: number;
  onSelect: (championId: string) => void;
};

const ChampionOptions = ({
  options,
  usedChampions,
  columns,
  onSelect,
}: Props) => (
  <Grid container spacing={3} justifyContent="center">
    {options.map((option, idx) => {
      const isUsed = usedChampions.includes(option.id);

      return (
        <Grid item xs={12} sm={6} md={3} key={option.id}>
          <Box
            component="button"
            type="button"
            disabled={isUsed}
            onClick={() => onSelect(option.id)}
            sx={{
              ...getOptionWrapperSx(columns, idx, isUsed),
              width: "100%",
              border: "none",
              font: "inherit",
            }}
          >
            <Box sx={optionCard}>
              <Box
                component="img"
                src={option.icon}
                alt={option.name}
                sx={optionIcon}
              />
              <Typography component="span" sx={optionName}>
                {option.name}
              </Typography>
            </Box>
          </Box>
        </Grid>
      );
    })}
  </Grid>
);

export default ChampionOptions;
