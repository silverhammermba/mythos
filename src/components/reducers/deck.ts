import { Deck } from '../../types/deck';
import { CardColor, Card } from '../../types/card';
import { remove, shuffle } from './array';
import { choose } from './choice';

// determine what stage we're in, based on the original deck counts
export function currentStage(stages: any[][], counts: number[]): number {
  // this is nontrivial since the deck can be modified during the game
  const stageCounts = [] as number[];

  // first collect total number of cards per-stage
  for (let s = 0; s < counts.length; s += 3) {
    let count = 0;
    for (let i = 0; i < 3 && s + i < counts.length; i += 1) {
      count += counts[s + i];
    }
    stageCounts.push(count);
  }

  // cards left in deck
  let remaining = stages.reduce((a, c) => a + c.length, 0);
  // remove cards from the bottom of the deck until we have none left
  for (let stage = stageCounts.length - 1; stage >= 0; stage -= 1) {
    remaining -= stageCounts[stage];
    // found current stage
    if (remaining <= 0) {
      return stage;
    }
  }

  return 0;
}

export enum DeckActionType {
  Build, // set up stages and active cards for game start
  ShuffleDeck,
  DiscardActive,
  Draw,
  UnimaginableHorror,
  TheStorm,
  AbandonHope,
  LostToTime,
  PactWithEibon,
  ArbiterOfFate,
  EvilOfOld,
}

export type DeckAction =
  | { type: DeckActionType.Build, startingRumor: boolean }
  | { type: DeckActionType.ShuffleDeck }
  | { type: DeckActionType.DiscardActive }
  | { type: DeckActionType.Draw }
  | { type: DeckActionType.UnimaginableHorror }
  | { type: DeckActionType.TheStorm }
  | { type: DeckActionType.AbandonHope }
  | { type: DeckActionType.LostToTime }
  | { type: DeckActionType.PactWithEibon }
  | { type: DeckActionType.ArbiterOfFate }
  | { type: DeckActionType.EvilOfOld };

export const deckReducer = (state: Deck, action: DeckAction): Deck => {
  switch (action.type) {
    case DeckActionType.Build: {
      const box = [...state.box];

      // ensure that active cards are not in the box (never should have duplicates)
      state.active.forEach((activeCard) => {
        remove(box, 1, (card: Card) => card.id === activeCard.id);
      });

      const active = [
        ...state.active,
        ...choose(state.difficulty, box, action.startingRumor ? 1 : 0, CardColor.Blue, 0),
      ];

      const numStages = 3;
      const colors = [CardColor.Green, CardColor.Yellow, CardColor.Blue];

      const stages: Card[][] = [];

      if (state.counts.length !== numStages * colors.length) {
        // console.error(`wrong number of ancient one deck stage counts: ${state.counts.length}`);
      }

      for (let s = 0; s < state.counts.length; s += colors.length) {
        const stage: Card[] = [];

        for (let i = 0; i < colors.length && s + i < state.counts.length; i += 1) {
          const color = colors[i];
          const count = state.counts[s + i];

          const drawn = choose(state.difficulty, box, count, color, stages.length);

          stage.push(...drawn);
        }

        stages.push(shuffle(stage));
      }

      return {
        ...state,
        discard: [],
        active,
        stages,
        box,
      };
    }
    case DeckActionType.ShuffleDeck: {
      const deck = shuffle(Array.prototype.concat.apply([], state.stages) as Card[]);
      return { ...state, stages: [[], [], deck] };
    }
    case DeckActionType.DiscardActive: {
      const active = [...state.active];
      const discard = [
        ...state.discard,
        ...remove(active, active.length, (card) => !card.ongoing),
      ];
      return { ...state, active, discard };
    }
    case DeckActionType.Draw: {
      const newState = deckReducer(state, { type: DeckActionType.DiscardActive });
      const active = [...newState.active];
      const stages = newState.stages.map((stage) => [...stage]);

      for (let i = 0; i < stages.length; i += 1) {
        const card = stages[i].shift();
        if (card) {
          active.push(card);
          break;
        }
      }

      return {
        ...newState,
        active,
        stages,
      };
    }
    case DeckActionType.UnimaginableHorror: { // yelw-08-HP
      const shuffled = deckReducer(state, { type: DeckActionType.ShuffleDeck });
      return deckReducer(shuffled, { type: DeckActionType.Draw });
    }
    case DeckActionType.TheStorm: { // yelw-28-HB
      const box = [...state.box];
      // get a rumor from the box
      const rumor = choose(
        state.difficulty,
        box,
        1,
        CardColor.Blue,
        currentStage(state.stages, state.counts),
      );

      // put it in play (and discard active cards)
      return deckReducer(
        { ...state, box, active: [...state.active, ...rumor] },
        { type: DeckActionType.DiscardActive },
      );
    }
    case DeckActionType.AbandonHope: { // yelw-72-HS
      const box = [...state.box];
      // get three yellow cards from the box
      const yellow = shuffle(choose(
        state.difficulty,
        box,
        3,
        CardColor.Yellow,
        currentStage(state.stages, state.counts),
      ));

      // put them in play (and discard active cards)
      return deckReducer(
        { ...state, box, active: [...state.active, ...yellow] },
        { type: DeckActionType.DiscardActive },
      );
    }
    case DeckActionType.LostToTime: {
      const discard = [...state.discard];
      const stages = state.stages.map((stage) => [...stage]);

      // discard top card of deck
      for (let i = 0; i < stages.length; i += 1) {
        const card = stages[i].shift();
        if (card) {
          discard.push(card);
          break;
        }
      }

      // shuffle
      return deckReducer({ ...state, stages, discard }, { type: DeckActionType.ShuffleDeck });
    }
    case DeckActionType.PactWithEibon: {
      const box = [...state.box];

      // get one green and one yellow from the box
      const stage = currentStage(state.stages, state.counts);
      const green = choose(state.difficulty, box, 1, CardColor.Green, stage);
      const yellow = choose(state.difficulty, box, 1, CardColor.Yellow, stage);

      // shuffle them into the deck
      const stages = [...state.stages, green, yellow];
      const deck = shuffle(Array.prototype.concat.apply([], stages) as Card[]);

      const discard = [...state.discard];

      // discard 3
      for (let i = 0; i < 3; i += 1) {
        const card = deck.shift();
        if (card) {
          discard.push(card);
        } else {
          break;
        }
      }

      return {
        ...state,
        box,
        discard,
        stages: [[], [], deck],
      };
    }
    case DeckActionType.ArbiterOfFate: { // Jacqueline's Consequence
      return deckReducer(state, { type: DeckActionType.ShuffleDeck });
    }
    case DeckActionType.EvilOfOld: // Marie's Consequence
      // same as Abandon Hope
      return deckReducer(state, { type: DeckActionType.AbandonHope });
    default:
      throw new Error(`unknown deck action ${action}`);
  }
};
