import { Box, Stack, Typography } from "@mui/material";

import AnswerOptions from "../../components/AnswerOptions/AnswerOptions";
import { PvpQuestion } from "../../services/pvpService";
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
        <AnswerOptions
          options={question.options}
          columns={columns}
          disabled={disabled}
          onSelect={onSelect}
        />
      </Stack>
    );
};

export default PvpQuestionPanel;
