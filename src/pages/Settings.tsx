import { Button, Stack } from "@mui/material";
import { useDispatch } from "react-redux";
import { resetAppState } from "../modules/app/state/slice";
import { resetLevelState } from "../modules/level/state/slice";

export default function Settings() {
  const dispatch = useDispatch();
  return (
    <Stack spacing={4} sx={{ p: 2 }}>
      <Button
        onClick={() => {
          dispatch(resetAppState());
          dispatch(resetLevelState());
        }}
        variant={"contained"}
        color={"error"}
      >
        Réinitialiser toutes les données
      </Button>
    </Stack>
  );
}
