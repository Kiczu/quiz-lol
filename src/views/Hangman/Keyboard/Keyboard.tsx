import { Button, Grid } from "@mui/material";

import { keyboardButtonBase } from "./keyboard.style";

type Props = {
  usedLetters: string[];
  onLetterClick: (letter: string) => void;
};

const Keyboard = ({ usedLetters, onLetterClick }: Props) => {
  return (
    <Grid
      container
      spacing={1.2}
      justifyContent="center"
      maxWidth={{ sm: "90%", md: "100%", lg: 600 }}
    >
      {Array.from({ length: 26 }, (_, i) => {
        const letter = String.fromCharCode(65 + i);
        const isUsed = usedLetters.includes(letter);

        return (
          <Grid item key={i}>
            <Button
              variant="outlined"
              onClick={() => onLetterClick(letter)}
              disabled={isUsed}
              sx={keyboardButtonBase(isUsed)}
            >
              {String.fromCharCode(65 + i)}
            </Button>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default Keyboard;
