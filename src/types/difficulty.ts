export enum DifficultyType {
  Random,
  NoHard,
  NoEasy,
  Easy,
  Hard,
  Staged,
  Custom,
}

// deck building difficulty (not mythos card difficulty)
export type DeckDifficulty =
 | { type: DifficultyType.Random }
 | { type: DifficultyType.NoHard }
 | { type: DifficultyType.NoEasy }
 | { type: DifficultyType.Easy }
 | { type: DifficultyType.Hard }
 | { type: DifficultyType.Staged, harderRumors: boolean }
 | { type: DifficultyType.Custom, easy: number, normal: number, hard: number };
