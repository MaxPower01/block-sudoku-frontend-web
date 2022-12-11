// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import SettingsIcon from "@mui/icons-material/Settings";
import { Box, Container } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import { useNavigate } from "react-router-dom";
import { CSSBreakpoint, Path } from "../../../utils/enums";

export default function TopBar() {
  const navigate = useNavigate();

  return (
    <AppBar
      position="sticky"
      component="header"
      sx={{ background: "transparent" }}
      elevation={0}
    >
      <Container maxWidth={CSSBreakpoint.Large}>
        <Toolbar disableGutters>
          {/* <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          <ArrowBackIcon />
        </IconButton> */}
          {/* <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1 }}
            onClick={() => navigate("/home")}
          >
            Block Sudoku
          </Typography> */}
          <Box sx={{ flexGrow: 1 }} />
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => navigate(Path.Leaderboard)}
          >
            <EmojiEventsIcon />
          </IconButton>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => navigate(Path.Settings)}
          >
            <SettingsIcon />
          </IconButton>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
