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

// a function for adding cards to the deck from the box
export type ChoiceFunction = (
  box: Card[],
  count: number,
  color: CardColor,
  stage?: number
) => Card[];
