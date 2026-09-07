import { Box, Typography } from "@mui/material";

import { answerWrapper, answerLetter } from "./answer.style";

type Props = {
  mask: string[];
};

const isRevealedLetter = (char: string) => /[a-zA-Z]/.test(char);

const Answer = ({ mask }: Props) => (
  <Box sx={answerWrapper}>
    {mask.map((value, key) => (
      <Typography
        variant="h3"
        component="span"
        key={key}
        sx={answerLetter(isRevealedLetter(value))}
      >
        {value === "" ? "_" : value}
      </Typography>
    ))}
  </Box>
);

export default Answer;
