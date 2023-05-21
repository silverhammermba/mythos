import { Card, CardColor } from './card';
import { Difficulty } from './difficulty';

// represents not just the deck but the entire mythos card state for the whole game
export interface Deck {
  discard: Card[],
  active: Card[],
  stages: Card[][],
  box: Card[], // unused cards (already shuffled)
  difficulty: Difficulty,
  counts: number[], // original stage counts (for determining stage later)
}

// a function for removing cards from the box
// a choice function assumes that the box is already shuffled
// its return value may be sorted according to some internal criteria
export type ChoiceFunction = (
  box: Card[],
  count: number,
  color: CardColor,
  stage?: number
) => Card[];
