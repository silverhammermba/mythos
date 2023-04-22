enum CardType {
  Green,
  Yellow,
  Blue,
}

enum CardDifficulty {
  Easy,
  Normal,
  Hard,
}

interface Card {
  id: string,
  color: CardType,
  difficulty: CardDifficulty,
  eldritch: number | undefined,
  clues: number | undefined,
}

// represents not just the deck but the entire mythos card state for the whole game
interface Deck {
  discard: Card[],
  active: Card[],
  stage1: Card[],
  stage2: Card[],
  stage3: Card[],
  box: Card[],
}

enum DeckActionType {
  SetBox, // set available cards
  Build, // set up stages and active cards for game start
  Draw,
}

function shuffle<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    // eslint-disable-next-line no-param-reassign
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export type DeckAction =
  | { type: DeckActionType.SetBox, cards: Card[] }
  | { type: DeckActionType.Build, counts: number[], active: Card[] }
  | { type: DeckActionType.Draw };

export const deckReducer = (state: Deck, action: DeckAction): Deck => {
  switch (action.type) {
    case DeckActionType.SetBox:
      return { ...state, box: action.cards };
    case DeckActionType.Build: {
      const box = [...state.box];
      const green = shuffle(state.box.filter((card) => card.color === CardType.Green));
      const yellow = shuffle(state.box.filter((card) => card.color === CardType.Yellow));
      const blue = shuffle(state.box.filter((card) => card.color === CardType.Blue));

      const stage1: Card[] = [];
      stage1.push(green.pop());
      const stage2: Card[] = [];
      const stage3: Card[] = [];
      action.counts[0]

      return state;
    }
    case DeckActionType.Draw:
      return state;
    default:
      throw new Error(`unknown deck action ${action}`);
  }
};
