import { Box, Typography } from "@mui/material";

import { answerWrapper, answerLetter } from "./answer.style";

type Props = {
  letters: { value: string; isCorrect: boolean }[];
};

const isLetterToGuess = (char: string) => /[a-zA-Z]/.test(char);

const Answer = ({ letters }: Props) => (
  <Box sx={answerWrapper}>
    {letters.map(({ value, isCorrect }, key) => (
      <Typography
        variant="h3"
        component="span"
        key={key}
        sx={answerLetter(isCorrect)}
      >
        {isLetterToGuess(value) ? (isCorrect ? value : "_") : value}
      </Typography>
    ))}
  </Box>
);

export default Answer;
