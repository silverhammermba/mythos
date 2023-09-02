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
  eldritch?: number,
  clues?: number,
  ongoing: boolean,
}
