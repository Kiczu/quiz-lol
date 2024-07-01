import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";

type Props = {
  title: string;
  desc: string;
  link: string;
  img: string;
};

const SelectModeCard = ({ title, desc, link, img }: Props) => {
  return (
    <Link to={link} style={{ textDecoration: "none" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
          border: "2px solid #af9767",
          background: "#1e2328",
          padding: "15px",
        }}
      >
        <Typography
          component={"h3"}
          variant="h3"
          sx={{
            fontSize: "1.3rem",
            color: "white",
            textTransform: "uppercase",
          }}
        >
          {title}
        </Typography>
      </Box>
    </Link>
  );
};

export default SelectModeCard;
