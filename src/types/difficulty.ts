export enum DifficultyType {
  Random,
  NoHard,
  NoEasy,
  Easy,
  Hard,
  Staged,
  StagedHarder,
  Custom,
}

// deck building difficulty (not mythos card difficulty)
export type Difficulty =
 | { type: DifficultyType.Random }
 | { type: DifficultyType.NoHard }
 | { type: DifficultyType.NoEasy }
 | { type: DifficultyType.Easy }
 | { type: DifficultyType.Hard }
 | { type: DifficultyType.Staged, harderRumors: boolean }
 | { type: DifficultyType.Custom, easy: number, normal: number, hard: number };
