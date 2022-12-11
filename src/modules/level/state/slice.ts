import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LocalStorageKey, SliceName } from "../../../utils/enums";
import getRandomIndexes from "../../block/utils/getRandomIndexes";
import GridModel from "../../grid/models/GridModel";
import { RootState } from "../../store/store";
import LevelState from "./LevelState";

function getDefaultState(): LevelState {
  return {
    score: 0,
    isHighestScore: false,
    gridCells: new GridModel().cells ?? [],
    blockIndexes: getRandomIndexes(3),
    hiddenBlockIds: [],
  };
}

function getLocalState(): LevelState | null {
  try {
    const serializedState = localStorage.getItem(LocalStorageKey.LevelState);
    if (serializedState == null) return null;
    return JSON.parse(serializedState) as LevelState;
  } catch (error) {
    console.error(error);
    return null;
  }
}

function resetLocalState() {
  try {
    localStorage.removeItem(LocalStorageKey.LevelState);
    saveState(getDefaultState());
  } catch (error) {
    console.error(error);
  }
}

function getInitialState(): LevelState {
  try {
    const localState = getLocalState();
    if (localState == null) {
      throw new Error(
        `Error while recovering ${LocalStorageKey.LevelState} in local storage. Resetting local state and returning default state.`
      );
    }
    return localState;
  } catch (error) {
    console.error(error);
    resetLocalState();
    return getDefaultState();
  }
}

function saveState(state: LevelState) {
  try {
    localStorage.setItem(LocalStorageKey.LevelState, JSON.stringify(state));
  } catch (error) {
    console.error(error);
  }
}

const initialState = getInitialState();

export const slice = createSlice({
  name: SliceName.Level,
  initialState,
  reducers: {
    updateLevelState: (state, action: PayloadAction<LevelState>) => {
      state.score = action.payload.score;
      state.gridCells = action.payload.gridCells;
      state.blockIndexes = action.payload.blockIndexes;
      state.hiddenBlockIds = action.payload.hiddenBlockIds;
      saveState(state);
    },
    resetLevelState: (state) => {
      const defaultState = getDefaultState();
      state.score = defaultState.score;
      state.gridCells = defaultState.gridCells;
      state.blockIndexes = defaultState.blockIndexes;
      state.hiddenBlockIds = defaultState.hiddenBlockIds;
      saveState(state);
    },
  },
});

export const {
  updateLevelState: updateLevelState,
  resetLevelState: resetLevelState,
} = slice.actions;

export const selectLevelState = (state: RootState) => state.level;
export const selectHasLevelInProgress = (state: RootState) =>
  state.level.score > 0;

export default slice.reducer;
