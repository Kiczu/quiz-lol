import { Grid, Box, Typography } from "@mui/material";

import { Region } from "../regionsData";

import {
  regionBoxSx,
  regionBackgroundSx,
  regionCrestSx,
  regionNameWrapperSx,
  regionNameTypographySx,
  getRegionCardWrapperSx,
} from "./regionList.style";

type Props = {
  regions: Region[];
  onSelect: (regionValue: string) => void;
  columns: number;
  usedRegions: string[];
};

const RegionList = ({ regions, onSelect, columns, usedRegions }: Props) => (
  <Grid container spacing={6} justifyContent="center">
    {regions.map((region, idx) => {
      const isUsed = usedRegions.includes(region.value);

      return (
        <Grid item xs={12} sm={6} md={3} xl={2} key={region.value}>
          <Box
            onClick={() => !isUsed && onSelect(region.value)}
            sx={{
              ...getRegionCardWrapperSx(columns, idx, 2),
              ...(isUsed && {
                opacity: 0.6,
                cursor: "not-allowed",
                pointerEvents: "none",
                filter: "grayscale(0.8)",
                "&:hover": {},
                "&:active": {},
              }),
            }}
          >
            <Box sx={regionBoxSx}>
              <Box
                className="region-bg"
                sx={regionBackgroundSx(region.background)}
              />
              <Box
                component="img"
                src={region.crest}
                alt={region.name}
                sx={regionCrestSx}
              />
              <Box sx={regionNameWrapperSx}>
                <Typography component="div" sx={regionNameTypographySx}>
                  {region.name}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Grid>
      );
    })}
  </Grid>
);

export default RegionList;
