import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Arcade from "../../../pages/Arcade";
import Home from "../../../pages/Home";
import Leaderboard from "../../../pages/Leaderboard";
import Levels from "../../../pages/Levels";
import Settings from "../../../pages/Settings";
import BottomBar from "../../navbars/components/BottomBar";
import TopBar from "../../navbars/components/TopBar";
import StoreProvider from "../../store/components/StoreProvider";
import ThemeProvider from "../../theme/components/ThemeProvider";

export default function App() {
  return (
    <StoreProvider>
      <ThemeProvider>
        <CssBaseline />
        <BrowserRouter>
          <TopBar />
          <Container
            component="main"
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 8,
              height: `calc(100% - 56px)`,
              paddingBottom: "56px",
            }}
          >
            <Routes>
              <Route path="" element={<Navigate replace to="/home" />} />
              <Route path="*" element={<Navigate replace to="/home" />} />
              <Route path="/home" element={<Home />} />
              <Route path="/arcade" element={<Arcade />} />
              <Route path="/levels" element={<Levels />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
            </Routes>
          </Container>
          <BottomBar />
        </BrowserRouter>
      </ThemeProvider>
    </StoreProvider>
  );
}
