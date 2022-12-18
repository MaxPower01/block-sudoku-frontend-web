import { TimeFrame } from "../../../utils/enums";

export default interface AppState {
  highScores: {
    [TimeFrame.Day]: {
      score: number;
      date: string;
    };
    [TimeFrame.Week]: {
      score: number;
      date: string;
    };
    [TimeFrame.Month]: {
      score: number;
      date: string;
    };
    [TimeFrame.Year]: {
      score: number;
      date: string;
    };
    [TimeFrame.AllTime]: {
      score: number;
      date: string;
    };
  };
}
