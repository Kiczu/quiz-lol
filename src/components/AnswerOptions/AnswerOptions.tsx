import { Box, Grid, Typography } from "@mui/material";

import {
  getOptionWrapperSx,
  optionCard,
  optionIcon,
  optionName,
} from "./answerOptions.style";

type Props = {
  options: { id: string; name: string; icon?: string }[];
  usedIds?: string[];
  columns: number;
  onSelect: (championId: string) => void;
  disabled?: boolean;
};

const AnswerOptions = ({
  options,
  usedIds = [],
  columns,
  onSelect,
  disabled = false,
}: Props) => (
  <Grid container spacing={3} justifyContent="center">
    {options.map((option, idx) => {
      const isUsed = usedIds.includes(option.id);

      return (
        <Grid item xs={12} sm={6} md={3} key={option.id} sx={{ display: "flex" }}>
          <Box
            component="button"
            type="button"
            disabled={disabled || isUsed}
            onClick={() => onSelect(option.id)}
            sx={{
              ...getOptionWrapperSx(columns, idx, disabled || isUsed),
              width: "100%",
              border: "none",
              font: "inherit",
            }}
          >
            <Box sx={{ ...optionCard, height: "100%", boxSizing: "border-box", overflowWrap: "anywhere" }}>
              {option.icon && <Box
                component="img"
                src={option.icon}
                alt=""
                sx={optionIcon}
              />}
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

export default AnswerOptions;
