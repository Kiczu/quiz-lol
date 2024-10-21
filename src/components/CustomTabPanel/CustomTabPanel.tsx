import { Box } from "@mui/material";
import { styled } from "@mui/system";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const StyledTabPanel = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 0,
  position: "absolute",
  [theme.breakpoints.down("md")]: {
    position: "relative",
  },
}));

const CustomTabPanel = (props: TabPanelProps) => {
  const { children, value, index } = props;

  return (
    <Box
      position={"relative"}
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
    >
      {value === index && <StyledTabPanel>{children}</StyledTabPanel>}
    </Box>
  );
};

export default CustomTabPanel;
