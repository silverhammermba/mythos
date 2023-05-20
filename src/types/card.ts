export enum CardColor {
  Green,
  Yellow,
  Blue,
}

export enum CardDifficulty {
  Easy,
  Normal,
  Hard,
}

export interface Card {
  id: string,
  color: CardColor,
  difficulty: CardDifficulty,
  eldritch: number | undefined,
  clues: number | undefined,
  ongoing: boolean,
}
