import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LocalStorageKey, SliceName, TimeFrame } from "../../../utils/enums";
import { RootState } from "../../store/store";
import AppState from "./AppState";

function getDefaultState(): AppState {
  return {
    highScores: {
      [TimeFrame.Day]: {
        score: 0,
        date: "",
      },
      [TimeFrame.Week]: {
        score: 0,
        date: "",
      },
      [TimeFrame.Month]: {
        score: 0,
        date: "",
      },
      [TimeFrame.Year]: {
        score: 0,
        date: "",
      },
      [TimeFrame.AllTime]: {
        score: 0,
        date: "",
      },
    },
  };
}

function getLocalState(): AppState | null {
  try {
    const serializedState = localStorage.getItem(LocalStorageKey.AppState);
    if (serializedState == null) return null;
    return JSON.parse(serializedState) as AppState;
  } catch (error) {
    console.error(error);
    return null;
  }
}

function resetLocalState() {
  try {
    localStorage.removeItem(LocalStorageKey.AppState);
    saveState(getDefaultState());
  } catch (error) {
    console.error(error);
  }
}

function getInitialState(): AppState {
  try {
    const localState = getLocalState();
    if (localState == null || localState.highScores == null) {
      throw new Error(
        `Error while recovering ${LocalStorageKey.AppState} in local storage. Resetting local state and returning default state.`
      );
    }
    Object.values(TimeFrame).forEach((timeFrame) => {
      const highScore = localState.highScores[timeFrame];
      if (
        highScore == null ||
        highScore.score == null ||
        highScore.date == null
      ) {
        throw new Error(
          `Error while recovering ${LocalStorageKey.AppState} in local storage. Resetting local state and returning default state.`
        );
      }
    });
    return localState;
  } catch (error) {
    console.error(error);
    resetLocalState();
    return getDefaultState();
  }
}

function saveState(state: AppState) {
  try {
    localStorage.setItem(LocalStorageKey.AppState, JSON.stringify(state));
  } catch (error) {
    console.error(error);
  }
}

const initialState = getInitialState();

export const slice = createSlice({
  name: SliceName.App,
  initialState,
  reducers: {
    updateHighScores: (state, action: PayloadAction<number>) => {
      const score = action.payload;
      const now = new Date().toISOString();
      Object.values(state.highScores).forEach((timeFrameHighScore) => {
        if (score > timeFrameHighScore.score) {
          timeFrameHighScore.score = score;
          timeFrameHighScore.date = now;
        }
      });
      saveState(state);
    },
    resetAppState: (state) => {
      const defaultState = getDefaultState();
      state.highScores = defaultState.highScores;
      saveState(state);
    },
  },
});

export const { updateHighScores, resetAppState } = slice.actions;

export const selectHighScores = (state: RootState) => state.app.highScores;

export default slice.reducer;
