interface Deck {
  cards: number[]
}

const enum DeckActionType {
  Build,
  Draw,
}

export type DeckAction =
  | { type: DeckActionType.Build }
  | { type: DeckActionType.Draw };

export const deckReducer = (state: Deck, action: DeckAction): Deck => {
  switch (action.type) {
    case DeckActionType.Build:
      return state;
    case DeckActionType.Draw:
      return state;
    default:
      throw new Error(`unknown deck action ${action}`);
  }
};
