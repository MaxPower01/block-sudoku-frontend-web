import GridCell from "../../grid/models/GridCell";

export default interface LevelState {
  score: number;
  isHighestScore: boolean;
  gridCells: Array<GridCell>;
  blockIndexes: Array<number>;
  hiddenBlockIds: Array<number>;
}
