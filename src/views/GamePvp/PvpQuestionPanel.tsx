import { Box, Grid, Stack, Typography } from "@mui/material";

import { PvpQuestion } from "../../services/pvpService";
import { getOptionWrapperSx, optionCard, optionIcon, optionName } from "../GameSkills/ChampionOptions/championOptions.style";
import { spellIconStyle, spellNameStyle } from "../GameSkills/skillsGame.style";

type Props = {
    question: PvpQuestion;
    columns: number;
    disabled: boolean;
    onSelect: (id: string) => void;
};

const PvpQuestionPanel = ({ question, columns, disabled, onSelect }: Props) => {
    const mixed = "prompt" in question;
    const image = mixed ? question.image : question.spellIcon;
    return (
      <Stack spacing={3} alignItems="center" sx={{ width: "100%" }}>
        <Typography variant="overline">{mixed ? question.category : "Abilities"}</Typography>
        {image && <Box component="img" src={image} alt="Question illustration" sx={spellIconStyle} />}
        <Typography variant="h3" sx={spellNameStyle}>{mixed ? question.prompt : question.spellName}</Typography>
        {!mixed && <Typography>Which champion does this ability belong to?</Typography>}
        {mixed && question.text && <Typography sx={{ maxWidth: 680, lineHeight: 1.7 }}>{question.text}</Typography>}
        <Grid container spacing={3} justifyContent="center">
            {question.options.map((option, index) => (
              <Grid item xs={12} sm={6} md={3} key={option.id} sx={{ display: "flex" }}>
                <Box
                    component="button"
                    type="button"
                    disabled={disabled}
                    onClick={() => onSelect(option.id)}
                    sx={{ ...getOptionWrapperSx(columns, index, disabled), width: "100%", border: "none", font: "inherit" }}
                >
                    <Box sx={{ ...optionCard, height: "100%", boxSizing: "border-box", overflowWrap: "anywhere" }}>
                        {option.icon && <Box component="img" src={option.icon} alt="" sx={optionIcon} />}
                        <Typography component="span" sx={optionName}>{option.name}</Typography>
                    </Box>
                </Box>
              </Grid>
            ))}
        </Grid>
      </Stack>
    );
};

export default PvpQuestionPanel;
