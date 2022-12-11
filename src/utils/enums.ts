export enum BlockShape {
  Square = 0,
  StraightLine = 1,
  DiagonalLine = 2,
  Corner = 3,
  L = 4,
}

/**
 * Reference:
 *
 * - [Breakpoints - MUI](https://mui.com/customization/breakpoints/)
 *
 * Default values:
 *
 * - xs, extra-small: 0px
 * - sm, small: 600px
 * - md, medium: 900px
 * - lg, large: 1200px
 * - xl, extra-large: 1536px
 */
export enum CSSBreakpoint {
  ExtraSmall = "xs",
  Small = "sm",
  Medium = "md",
  Large = "lg",
  ExtraLarge = "xl",
}

export enum LocalStorageKey {
  AppState = "appState",
  LevelState = "levelState",
}

export enum SliceName {
  App = "app",
  Level = "level",
}

export enum Path {
  Root = "/block-sudoku-frontend-web",
  Home = "/block-sudoku-frontend-web/home",
  Arcade = "/block-sudoku-frontend-web/arcade",
  Levels = "/block-sudoku-frontend-web/levels",
  Settings = "/block-sudoku-frontend-web/settings",
  Leaderboard = "/block-sudoku-frontend-web/leaderboard",
}
