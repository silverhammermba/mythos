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
  ongoing: boolean,
}

// represents not just the deck but the entire mythos card state for the whole game
interface Deck {
  discard: Card[],
  active: Card[],
  stages: Card[][],
  box: Card[], // unused cards (already shuffled)
  difficulty: Difficulty,
  counts: number[], // original stage counts (for determining stage later)
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

  for (let i = 0; i < array.length && removed.length < count; i += 1) {
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

type ChoiceFunction = (
  box: Card[],
  count: number,
  color: CardColor,
  stage?: number
) => Card[];

// choose cards simply based on order in the box
function randomChoice(
  box: Card[],
  count: number,
  color: CardColor,
): Card[] {
  const drawn = remove(box, count, (card) => card.color === color);
  if (drawn.length < count) {
    console.warn(`not enough ${CardColor[color]} cards.`);
  }
  return drawn;
}

// prefer choosing non-hard cards if possible
function noHardChoice(
  box: Card[],
  count: number,
  color: CardColor,
): Card[] {
  const notHard = remove(box, count, (card) => card.color === color
    && card.difficulty !== CardDifficulty.Hard);

  if (notHard.length < count) {
    console.warn(`not enough non-hard ${CardColor[color]} cards. adding some hard ones`);
  }

  const hard = randomChoice(box, count - notHard.length, color);

  return [...notHard, ...hard];
}

// prefer choosing only normal cards, falling back to random
// N.B. this isn't a difficulty option, but it's useful for other choice functions
function normalChoice(
  box: Card[],
  count: number,
  color: CardColor,
): Card[] {
  const normal = remove(box, count, (card) => card.color === color
    && card.difficulty === CardDifficulty.Normal);

  if (normal.length < count) {
    console.warn(`not enough normal ${CardColor[color]} cards. adding some random ones`);
  }

  const nonNormal = randomChoice(box, count - normal.length, color);

  return [...nonNormal, ...normal];
}

// prefer choosing non-easy cards if possible
function noEasyChoice(
  box: Card[],
  count: number,
  color: CardColor,
): Card[] {
  const notEasy = remove(box, count, (card) => card.color === color
    && card.difficulty !== CardDifficulty.Easy);

  if (notEasy.length < count) {
    console.warn(`not enough non-easy ${CardColor[color]} cards. adding some easy ones`);
  }

  const easy = randomChoice(box, count - notEasy.length, color);

  return [...notEasy, ...easy];
}

// prefer choosing easy cards, falling back to normal, then hard
function easyChoice(
  box: Card[],
  count: number,
  color: CardColor,
): Card[] {
  const easy = remove(box, count, (card) => card.color === color
    && card.difficulty === CardDifficulty.Easy);

  if (easy.length < count) {
    console.warn(`not enough easy ${CardColor[color]} cards. adding some normal ones`);
  }

  const normal = remove(box, count - easy.length, (card) => card.color === color
    && card.difficulty === CardDifficulty.Normal);

  if (easy.length + normal.length < count) {
    console.warn(`not enough normal ${CardColor[color]} cards. adding some hard ones`);
  }

  const hard = randomChoice(box, count - easy.length - normal.length, color);

  return [...easy, ...normal, ...hard];
}

// prefer choosing hard cards, falling back to normal, then easy
function hardChoice(
  box: Card[],
  count: number,
  color: CardColor,
): Card[] {
  const hard = remove(box, count, (card) => card.color === color
    && card.difficulty === CardDifficulty.Hard);

  if (hard.length < count) {
    console.warn(`not enough hard ${CardColor[color]} cards. adding some normal ones`);
  }

  const normal = remove(box, count - hard.length, (card) => card.color === color
    && card.difficulty === CardDifficulty.Normal);

  if (hard.length + normal.length < count) {
    console.warn(`not enough normal ${CardColor[color]} cards. adding some easy ones`);
  }

  const easy = randomChoice(box, count - hard.length - normal.length, color);

  return [...easy, ...normal, ...hard];
}

// return a choice function that chooses card difficulty based on stage
function stagedChoice(
  harderRumors: boolean,
): ChoiceFunction {
  return (
    box: Card[],
    count: number,
    color: CardColor,
    stage: number | undefined,
  ) => {
    if (stage === undefined) {
      return randomChoice(box, count, color);
    }

    let choice: ChoiceFunction | undefined;

    switch (stage + (harderRumors && color === CardColor.Blue ? 1 : 0)) {
      case 0:
        choice = easyChoice;
        break;
      case 1:
        choice = normalChoice;
        break;
      default:
        choice = hardChoice;
        break;
    }

    return choice(box, count, color);
  };
}

// return a choice function that chooses based on the given proportion of difficulties
function customChoice(
  easy: number,
  normal: number,
  hard: number,
): ChoiceFunction {
  const total = easy + normal + hard;
  const minNormal = easy / total;
  const minHard = (easy + normal) / total;

  // randomly choose a choice function based on the difficulty proportion
  const randomChoiceFunction = () => {
    const r = Math.random();
    if (r < minNormal) {
      return easyChoice;
    }
    if (r < minHard) {
      return normalChoice;
    }
    return hardChoice;
  };

  return (
    box: Card[],
    count: number,
    color: CardColor,
  ) => {
    const cards: Card[] = [];

    for (let c = 0; c < count; c += 1) {
      const found = randomChoiceFunction()(box, 1, color);

      if (found.length) {
        cards.push(found[0]);
      } else {
        // the random choice function only under-chooses if we ran out of a color entirely
        break;
      }
    }

    return cards;
  };
}

// determine what stage we're in, based on the original deck counts
function currentStage(stages: Card[][], counts: number[]) {
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

enum DifficultyType {
  Random,
  NoHard,
  NoEasy,
  Easy,
  Hard,
  Staged,
  StagedHarder,
  Custom,
}

export type Difficulty =
 | { type: DifficultyType.Random }
 | { type: DifficultyType.NoHard }
 | { type: DifficultyType.NoEasy }
 | { type: DifficultyType.Easy }
 | { type: DifficultyType.Hard }
 | { type: DifficultyType.Staged, harderRumors: boolean }
 | { type: DifficultyType.Custom, easy: number, normal: number, hard: number };

function choose(
  difficulty: Difficulty,
  box: Card[],
  count: number,
  color: CardColor,
  stage: number | undefined,
): Card[] {
  let choice: ChoiceFunction | undefined;
  switch (difficulty.type) {
    case DifficultyType.Random:
      choice = randomChoice;
      break;
    case DifficultyType.NoHard:
      choice = noHardChoice;
      break;
    case DifficultyType.NoEasy:
      choice = noEasyChoice;
      break;
    case DifficultyType.Easy:
      choice = easyChoice;
      break;
    case DifficultyType.Hard:
      choice = hardChoice;
      break;
    case DifficultyType.Staged:
      choice = stagedChoice(difficulty.harderRumors);
      break;
    case DifficultyType.Custom:
      choice = customChoice(difficulty.easy, difficulty.normal, difficulty.hard);
      break;
    default:
      throw new Error(`unknown difficulty ${difficulty}`);
  }
  return choice(box, count, color, stage);
}

enum DeckActionType {
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
  | {
    type: DeckActionType.Build,
    cards: Card[],
    counts: number[],
    active: Card[],
    difficulty: Difficulty,
    startingRumor: boolean,
  }
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
      const box = shuffle([...action.cards]);

      // ensure that active cards are not in the box (never should have duplicates)
      action.active.forEach((activeCard) => {
        remove(box, 1, (card: Card) => card.id === activeCard.id);
      });

      const active = [
        ...action.active,
        ...choose(action.difficulty, box, action.startingRumor ? 1 : 0, CardColor.Blue, 0),
      ];

      const numStages = 3;
      const colors = [CardColor.Green, CardColor.Yellow, CardColor.Blue];

      const stages: Card[][] = [];

      if (action.counts.length !== numStages * colors.length) {
        console.error(`wrong number of ancient one deck stage counts: ${action.counts.length}`);
      }

      for (let s = 0; s < action.counts.length; s += colors.length) {
        const stage: Card[] = [];

        for (let i = 0; i < colors.length && s + i < action.counts.length; i += 1) {
          const color = colors[i];
          const count = action.counts[s + i];

          const drawn = choose(action.difficulty, box, count, color, stages.length);

          stage.push(...drawn);
        }

        stages.push(shuffle(stage));
      }

      return {
        discard: [],
        active,
        stages,
        box,
        difficulty: action.difficulty,
        counts: action.counts,
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
      const yellow = choose(
        state.difficulty,
        box,
        3,
        CardColor.Yellow,
        currentStage(state.stages, state.counts),
      );

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
