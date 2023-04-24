enum CardColor {
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
  color: CardColor,
  difficulty: CardDifficulty,
  eldritch: number | undefined,
  clues: number | undefined,
}

// represents not just the deck but the entire mythos card state for the whole game
interface Deck {
  discard: Card[],
  active: Card[],
  stages: Card[][],
  box: Card[],
}

enum DeckActionType {
  SetBox, // set available cards
  Build, // set up stages and active cards for game start
  Draw,
}

// shuffle array in place
function shuffle<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    // eslint-disable-next-line no-param-reassign
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// remove first count elements satisfying predicate from array in-place and return them
function remove<T>(
  array: T[],
  count: number,
  predicate: (value: T, index: number | undefined, array: T[] | undefined) => Boolean,
): T[] {
  const indices: number[] = [];
  const removed: T[] = [];

  for (let i = 0; i < array.length; i += 1) {
    if (predicate(array[i], i, array)) {
      indices.push(i);
      removed.push(array[i]);
    }
  }

  for (let i = indices.length - 1; i >= 0; i -= 1) {
    array.splice(i, 1);
  }

  return removed;
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
      // shuffle the cards so that they're already random when building stages
      const box = shuffle([...state.box]);

      // ensure that active cards are not in the box (never should have duplicates)
      action.active.forEach((activeCard) => {
        remove(box, 1, (card: Card) => card.id === activeCard.id);
      });

      const numStages = 3;
      const colors = [CardColor.Green, CardColor.Yellow, CardColor.Blue];

      const stages: Card[][] = [];
      const missing: { type: string, count: number }[] = [];

      if (action.counts.length !== numStages * colors.length) {
        console.error(`wrong number of ancient one deck stage counts: ${action.counts.length}`);
      }

      for (let s = 0; s < action.counts.length; s += colors.length) {
        const stage: Card[] = [];

        for (let i = 0; i < colors.length && s + i < action.counts.length; i += 1) {
          const color = colors[i];
          const criteria = CardColor[color];
          const count = action.counts[s + i];

          const drawn = remove(box, count, (card: Card) => card.color === color);
          const numberMissing = count - drawn.length;

          if (numberMissing) {
            missing.push({
              type: criteria,
              count: numberMissing,
            });
          } else {
            stage.push(...drawn);
          }
        }

        stages.push(shuffle(stage));
      }

      return {
        discard: [],
        active: action.active,
        stages,
        box,
      };
    }
    case DeckActionType.Draw:
      return state;
    default:
      throw new Error(`unknown deck action ${action}`);
  }
};
