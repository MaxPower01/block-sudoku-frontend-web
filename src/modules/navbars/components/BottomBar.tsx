import HomeIcon from "@mui/icons-material/Home";
import TimelineIcon from "@mui/icons-material/Timeline";
import { Container, Typography } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import { useNavigate } from "react-router-dom";
import { CSSBreakpoint } from "../../../utils/enums";

export default function BottomBar() {
  const navigate = useNavigate();

  const iconButtonStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flexGrow: 1,
    borderRadius: 2,
  };
  const iconButtonLabelStyle: React.CSSProperties = {
    fontSize: 10,
  };
  return (
    <AppBar
      position="fixed"
      color="primary"
      sx={{ top: "auto", bottom: 0 }}
      component="footer"
    >
      <Container maxWidth={CSSBreakpoint.Large}>
        <Toolbar disableGutters>
          {/* <Box sx={{ flexGrow: 1 }} /> */}
          <IconButton
            color="inherit"
            sx={iconButtonStyle}
            onClick={() => navigate("/home")}
          >
            <HomeIcon />
            <Typography variant="button" sx={iconButtonLabelStyle}>
              Accueil
            </Typography>
          </IconButton>
          <IconButton
            color="inherit"
            sx={iconButtonStyle}
            onClick={() => navigate("/levels")}
          >
            <TimelineIcon />
            <Typography variant="button" sx={iconButtonLabelStyle}>
              Niveaux
            </Typography>
          </IconButton>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
