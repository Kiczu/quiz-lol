import { useState } from "react";
import { Box, Tab, Tabs, Typography } from "@mui/material";
import CustomTabPanel from "../../../components/CustomTabPanel/CustomTabPanel";
import { spellName } from "../champion.style";

interface Spell {
  id: string;
  name: string;
  description: string;
  image: { full: string };
}

type Props = {
  spells: Spell[];
};

const SkillsTabs = ({ spells }: Props) => {
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
      >
        {spells.map((spell, i) => (
          <Tab
            key={spell.id}
            icon={
              <img
                src={`https://ddragon.leagueoflegends.com/cdn/14.13.1/img/spell/${spell.image.full}`}
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
