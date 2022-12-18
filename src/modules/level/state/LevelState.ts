import { TimeFrame } from "../../../utils/enums";
import GridCell from "../../grid/models/GridCell";

export default interface LevelState {
  score: number;
  isHighScoreOfTimeFrame: TimeFrame | null;
  gridCells: Array<GridCell>;
  blockIndexes: Array<number>;
  hiddenBlockIds: Array<number>;
}
