import { XyzTransition } from "@animxyz/react";
import { Box, Button, Stack } from "@mui/material";
import Typography from "@mui/material/Typography";
import Confetti from "react-confetti";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import TrophySVG from "../../../assets/trophy-01.svg";
import { Path, TimeFrame } from "../../../utils/enums";
import { resetLevelState } from "../state/slice";

export default function GameOverDialog(props: {
  score: number;
  isHighestScoreOfTimeFrame: TimeFrame | null;
}) {
  const { score, isHighestScoreOfTimeFrame } = props;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleButtonClick = () => {
    dispatch(resetLevelState());
    navigate(Path.Home);
  };
  const isHighestScore = isHighestScoreOfTimeFrame != null;
  const toggled = true;

  let title = "Partie terminée";

  if (isHighestScore) {
    switch (isHighestScoreOfTimeFrame) {
      case TimeFrame.AllTime:
        title = "Nouveau meilleur score de tous les temps!";
        break;
      case TimeFrame.Year:
        title = "Nouveau meilleur score de l'année!";
        break;
      case TimeFrame.Month:
        title = "Nouveau meilleur score du mois!";
        break;
      case TimeFrame.Week:
        title = "Nouveau meilleur score de la semaine!";
        break;
      case TimeFrame.Day:
        title = "Nouveau meilleur score du jour!";
        break;
      default:
        title = "Nouveau meilleur score!";
        break;
    }
  }

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
                overflow: "hidden",
              }}
            >
              <Confetti
                width={window.innerWidth}
                height={window.innerHeight}
                recycle={false}
                gravity={0.05}
                numberOfPieces={1000}
                initialVelocityY={10}
                tweenDuration={10000}
              />
            </Box>
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
              <Typography variant="h6" textAlign={"center"} gutterBottom>
                {title}
              </Typography>
              {/* <Typography variant="body2" textAlign={"center"}>
                Votre score:
              </Typography> */}
              <Typography variant="h2" textAlign={"center"}>
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
