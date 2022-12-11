import { XyzTransition } from "@animxyz/react";
import { Box, Button, Stack } from "@mui/material";
import Typography from "@mui/material/Typography";
import Confetti from "react-confetti";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import TrophySVG from "../../../assets/trophy-01.svg";
import { resetLevelState } from "../state/slice";

export default function GameOverDialog(props: {
  score: number;
  isHighestScore: boolean;
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleButtonClick = () => {
    dispatch(resetLevelState());
    navigate("/home");
  };

  const { score, isHighestScore } = props;
  const toggled = true;

  return (
    <XyzTransition appear xyz="fade ease-out-back">
      {toggled && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 2,
            background: "rgba(0,0,0,0.75)",
          }}
        >
          {isHighestScore ? (
            <Confetti
              width={window.innerWidth}
              height={window.innerHeight}
              recycle={false}
              gravity={0.05}
              numberOfPieces={1000}
            />
          ) : null}
          <Stack spacing={4}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img
                src={TrophySVG}
                alt="Trophy"
                style={{
                  width: "100px",
                  height: "auto",
                }}
              />
            </Box>
            <Stack>
              <Typography variant="h4" textAlign={"center"} gutterBottom>
                {isHighestScore ? "Nouveau record!" : "Partie terminée"}
              </Typography>
              <Typography variant="body1" textAlign={"center"}>
                Votre score:
              </Typography>
              <Typography variant="h4" textAlign={"center"}>
                {score}
              </Typography>
            </Stack>
            <Button onClick={handleButtonClick} variant={"contained"}>
              Retour à l'accueil
            </Button>
          </Stack>
        </Box>
      )}
    </XyzTransition>
  );
}
