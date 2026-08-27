import { Box, Tab, Tabs, Typography } from "@mui/material";
import { useState } from "react";

import CustomTabPanel from "../../../components/CustomTabPanel/CustomTabPanel";
import { characterService } from "../../../services/characterService";
import { spellName } from "../champion.style";

interface Spell {
  id: string;
  name: string;
  description: string;
  image: { full: string };
}

type Props = {
  spells: Spell[];
  version: string;
};

const SkillsTabs = ({ spells, version }: Props) => {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) =>
    setValue(newValue);

  return (
    <Box>
      <Tabs
        value={value}
        onChange={handleChange}
        scrollButtons="auto"
        variant="scrollable"
        allowScrollButtonsMobile
      >
        {spells.map((spell, i) => (
          <Tab
            key={spell.id}
            icon={
              <img
                src={characterService.getSpellImageUrl(spell.image.full, version)}
                alt={spell.name}
              />
            }
            id={`simple-tab-${i}`}
            aria-controls={`simple-tabpanel-${i}`}
          />
        ))}
      </Tabs>
      {spells.map((spell, i) => (
        <CustomTabPanel key={spell.id} value={value} index={i}>
          <Typography component="p" sx={spellName}>
            {spell.name}
          </Typography>
          <Typography component="p">{spell.description}</Typography>
        </CustomTabPanel>
      ))}
    </Box>
  );
};

export default SkillsTabs;
