import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LocalStorageKey, SliceName } from "../../../utils/enums";
import { RootState } from "../../store/store";
import AppState from "./AppState";

function getDefaultState(): AppState {
  return {
    highestScore: 0,
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
    if (localState == null) {
      throw new Error(
        `Error while recovering ${LocalStorageKey.AppState} in local storage. Resetting local state and returning default state.`
      );
    }
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
    updateHighestScore: (state, action: PayloadAction<number>) => {
      state.highestScore = action.payload;
      saveState(state);
    },
    resetAppState: (state) => {
      const defaultState = getDefaultState();
      state.highestScore = defaultState.highestScore;
      saveState(state);
    },
  },
});

export const { updateHighestScore, resetAppState } = slice.actions;

export const selectHighestScore = (state: RootState) => state.app.highestScore;

export default slice.reducer;
