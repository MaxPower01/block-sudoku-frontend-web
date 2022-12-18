import { Button, Stack, Typography } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useTheme } from "@mui/material/styles";
import * as React from "react";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import TrophySVG from "../assets/trophy-01.svg";
import { selectHighScores } from "../modules/app/state/slice";
import {
  resetLevelState,
  selectHasLevelInProgress,
} from "../modules/level/state/slice";
import { Path } from "../utils/enums";

export default function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const highScores = useSelector(selectHighScores);
  const hasLevelInProgress = useSelector(selectHasLevelInProgress);
  const [newGameDialogOpened, setNewGameDialogOpened] = React.useState(false);
  const theme = useTheme();

  const startNewGame = () => {
    dispatch(resetLevelState());
    navigate(Path.Arcade);
  };

  const handleNewGameButtonClick = useCallback(() => {
    if (hasLevelInProgress) {
      setNewGameDialogOpened(true);
    } else {
      startNewGame();
    }
  }, [hasLevelInProgress]);

  const handleClose = () => {
    setNewGameDialogOpened(false);
  };

  return (
    <>
      <Stack spacing={4} sx={{ p: 2 }}>
        <Typography variant="h3" textAlign={"center"}>
          Block Sudoku
        </Typography>
        <Stack spacing={1}>
          <Typography variant="body2" textAlign={"center"}>
            Meilleur score de tous les temps
          </Typography>
          <Stack
            spacing={1}
            direction={"row"}
            alignItems="center"
            justifyContent={"center"}
          >
            {highScores.allTime.score > 0 ? (
              <img
                src={TrophySVG}
                alt="Trophy"
                style={{
                  width: theme.typography.h4.fontSize,
                  height: "auto",
                  display: "inline-block",
                }}
              />
            ) : null}
            <Typography variant="h4" textAlign={"center"}>
              {highScores.allTime.score}
            </Typography>
          </Stack>
        </Stack>
        <Stack spacing={1}>
          {hasLevelInProgress ? (
            <Button
              onClick={() => {
                navigate(Path.Arcade);
              }}
              variant={"contained"}
            >
              Continuer
            </Button>
          ) : null}
          <Button
            onClick={() => {
              handleNewGameButtonClick();
            }}
            variant={hasLevelInProgress ? "outlined" : "contained"}
          >
            Nouvelle partie
          </Button>
        </Stack>
      </Stack>

      <Dialog
        open={newGameDialogOpened}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Commencer une nouvelle partie?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Tous les progrès de la partie en cours seront perdus.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Annuler</Button>
          <Button
            onClick={() => {
              startNewGame();
            }}
            autoFocus
            variant={"contained"}
          >
            Nouvelle partie
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
