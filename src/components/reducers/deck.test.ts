import { currentStage, deckReducer, DeckActionType } from './deck';
import { DifficultyType } from '../../types/difficulty';
import { Deck } from '../../types/deck';
import { ids, mockBox } from './choice.test';
import { Card, CardColor, CardDifficulty } from '../../types/card';

//                    3        3        3
const counts = [3, 0, 0, 1, 1, 1, 0, 2, 1];

describe('currentStage', () => {
  it('works with empty deck', () => {
    const empty = currentStage([[], [], []], counts);
    expect(empty).toEqual(2);
  });

  it('doesn\'t depend on stage composition of the deck', () => {
    const first = currentStage([[0, 0, 0, 0], [], []], counts);
    expect(first).toEqual(1);

    const second = currentStage([[], [0, 0, 0, 0], []], counts);
    expect(second).toEqual(1);

    const third = currentStage([[], [], [0, 0, 0, 0]], counts);
    expect(third).toEqual(1);
  });

  it('returns first stage when deck is overfull', () => {
    const first = currentStage([Array(4).fill(0), Array(4).fill(0), Array(4).fill(0)], counts);
    expect(first).toEqual(0);
  });

  it('works with weird counts', () => {
    const no2 = currentStage([Array(9).fill(0)], [3, 2, 1, 0, 0, 0, 8]);
    expect(no2).toEqual(0);

    const dangling = currentStage([Array(8).fill(0)], [3, 2, 1, 0, 0, 0, 8]);
    expect(dangling).toEqual(2);

    const tooMany = currentStage([Array(1).fill(0)], [3, 2, 1, 0, 0, 0, 8, 0, 0, 2]);
    expect(tooMany).toEqual(3);
  });
});

describe('DeckAction.Build', () => {
  it('basically works', () => {
    const input: Deck = {
      box: mockBox([
        [CardColor.Green, CardDifficulty.Easy],
        [CardColor.Yellow, CardDifficulty.Easy],
        [CardColor.Green, CardDifficulty.Easy],
        [CardColor.Blue, CardDifficulty.Normal],
        [CardColor.Blue, CardDifficulty.Hard],
      ]),
      difficulty: { type: DifficultyType.Random },
      discard: mockBox([[CardColor.Blue, CardDifficulty.Hard]]),
      active: [{
        id: 'foo',
        color: CardColor.Green,
        difficulty: CardDifficulty.Hard,
        eldritch: 0,
        clues: 0,
        ongoing: false,
      }],
      stages: [mockBox([[CardColor.Green, CardDifficulty.Easy]])],
      counts,
    };

    const built = deckReducer(input, { type: DeckActionType.Build, startingRumor: false });
    expect(ids(built.box)).toEqual([]);
    expect(built.difficulty.type).toEqual(DifficultyType.Random);
    expect(ids(built.discard)).toEqual([]);
    expect(built.active).toEqual(input.active);
    expect(built.stages.length).toEqual(3);
    expect(built.stages.map((s) => ids(s).sort())).toEqual([['0', '2'], ['1', '3'], ['4']]);
    expect(built.counts).toEqual(counts);
  });

  it('dedups active cards', () => {
    const input: Deck = {
      box: mockBox([
        [CardColor.Green, CardDifficulty.Easy],
        [CardColor.Yellow, CardDifficulty.Easy],
        [CardColor.Green, CardDifficulty.Easy],
        [CardColor.Blue, CardDifficulty.Normal],
        [CardColor.Blue, CardDifficulty.Hard],
      ]),
      difficulty: { type: DifficultyType.Random },
      discard: [],
      active: mockBox([[CardColor.Green, CardDifficulty.Hard]]),
      stages: [],
      counts,
    };

    const built = deckReducer(input, { type: DeckActionType.Build, startingRumor: false });
    // 0 is gone because the active card has the same ID
    expect(built.stages.map((s) => ids(s).sort())).toEqual([['2'], ['1', '3'], ['4']]);
  });

  it('adds starting rumors', () => {
    const input: Deck = {
      box: mockBox([
        [CardColor.Green, CardDifficulty.Easy],
        [CardColor.Yellow, CardDifficulty.Easy],
        [CardColor.Green, CardDifficulty.Easy],
        [CardColor.Blue, CardDifficulty.Easy],
        [CardColor.Blue, CardDifficulty.Normal],
      ]),
      difficulty: { type: DifficultyType.Staged, harderRumors: true },
      discard: [],
      active: [{
        id: 'foo',
        color: CardColor.Green,
        difficulty: CardDifficulty.Hard,
        eldritch: 0,
        clues: 0,
        ongoing: false,
      }],
      stages: [],
      counts,
    };

    const built = deckReducer(input, { type: DeckActionType.Build, startingRumor: true });
    // should skip rumor id 3 since it is wrong difficulty
    expect(ids(built.active)).toEqual(['foo', '4']);
    // 4 is gone because it's active
    expect(built.stages.map((s) => ids(s).sort())).toEqual([['0', '2'], ['1', '3'], []]);
  });

  it('can build a deck with weird counts', () => {
    const input: Deck = {
      box: mockBox([
        [CardColor.Green, CardDifficulty.Easy],
        [CardColor.Yellow, CardDifficulty.Easy],
        [CardColor.Green, CardDifficulty.Easy],
        [CardColor.Blue, CardDifficulty.Easy],
        [CardColor.Blue, CardDifficulty.Normal],
      ]),
      difficulty: { type: DifficultyType.Random },
      discard: [],
      active: [],
      stages: [],
      counts: [1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 4],
    };

    const built = deckReducer(input, { type: DeckActionType.Build, startingRumor: false });
    expect(built.stages.map((s) => ids(s).sort())).toEqual([['0'], ['2'], ['3'], ['1']]);
  });
});

describe('DeckAction.ShuffleDeck', () => {
  it('works', () => {
    const input: Deck = {
      box: [],
      difficulty: { type: DifficultyType.Random },
      discard: [],
      active: [],
      stages: [mockBox([
        [CardColor.Green, CardDifficulty.Easy],
        [CardColor.Yellow, CardDifficulty.Normal],
      ]), mockBox([
        [CardColor.Blue, CardDifficulty.Easy],
      ]), mockBox([
        [CardColor.Green, CardDifficulty.Hard],
      ])],
      counts: [],
    };

    const shuffled = deckReducer(input, { type: DeckActionType.ShuffleDeck });
    expect(shuffled.stages.map((s) => s.map((c) => `${c.id}${c.color}`).sort())).toEqual([
      [],
      [],
      ['00', '00', '02', '11'],
    ]);
  });
});

describe('DeckAction.DiscardActive', () => {
  it('works', () => {
    const input: Deck = {
      box: [],
      difficulty: { type: DifficultyType.Random },
      discard: mockBox([[CardColor.Green, CardDifficulty.Easy]]),
      active: [
        {
          id: 'a',
          color: CardColor.Blue,
          difficulty: CardDifficulty.Normal,
          ongoing: true,
        },
        {
          id: 'b',
          color: CardColor.Yellow,
          difficulty: CardDifficulty.Hard,
          ongoing: false,
        },
      ],
      stages: [],
      counts: [],
    };

    const discarded = deckReducer(input, { type: DeckActionType.DiscardActive });
    expect(discarded.discard.map((c) => c.id)).toEqual(['0', 'b']);
    expect(discarded.active.map((c) => c.id)).toEqual(['a']);
  });

  it('can do nothing', () => {
    const input: Deck = {
      box: [],
      difficulty: { type: DifficultyType.Random },
      discard: [],
      active: [],
      stages: [],
      counts: [],
    };

    const discarded = deckReducer(input, { type: DeckActionType.DiscardActive });
    expect(discarded).toEqual(input);
  });
});

describe('DeckAction.Draw', () => {
  it('works', () => {
    const input: Deck = {
      box: [],
      difficulty: { type: DifficultyType.Random },
      discard: [
        {
          id: 'a', color: CardColor.Blue, difficulty: CardDifficulty.Hard, ongoing: true,
        },
      ],
      active: [
        {
          id: 'b', color: CardColor.Blue, difficulty: CardDifficulty.Hard, ongoing: true,
        },
        {
          id: 'c', color: CardColor.Blue, difficulty: CardDifficulty.Hard, ongoing: false,
        },
      ],
      stages: [
        [],
        [
          {
            id: 'd', color: CardColor.Blue, difficulty: CardDifficulty.Hard, ongoing: false,
          },
          {
            id: 'e', color: CardColor.Blue, difficulty: CardDifficulty.Hard, ongoing: false,
          },
        ],
        [
          {
            id: 'f', color: CardColor.Blue, difficulty: CardDifficulty.Hard, ongoing: false,
          },
        ],
      ],
      counts: [],
    };

    const drew = deckReducer(input, { type: DeckActionType.Draw });
    expect(drew.discard.map((c) => c.id)).toEqual(['a', 'c']);
    expect(drew.active.map((c) => c.id)).toEqual(['b', 'd']);
    expect(drew.stages.map((s) => s.map((c) => c.id))).toEqual([[], ['e'], ['f']]);
  });

  it('can do nothing', () => {
    const input: Deck = {
      box: [],
      difficulty: { type: DifficultyType.Random },
      discard: [],
      active: [],
      stages: [],
      counts: [],
    };

    const discarded = deckReducer(input, { type: DeckActionType.Draw });
    expect(discarded).toEqual(input);
  });
});

describe('DeckAction.UnimaginableHorror', () => {
  // skipping tests because it's trivial
});

describe('DeckAction.TheStorm', () => {
  // skipping tests because it's very similar to AbandonHope
});

describe('DeckAction.AbandonHope', () => {
  it('works', () => {
    const input: Deck = {
      box: [
        {
          id: 'a', color: CardColor.Green, difficulty: CardDifficulty.Hard, ongoing: true,
        },
        {
          id: 'x', color: CardColor.Yellow, difficulty: CardDifficulty.Easy, ongoing: false,
        },
        {
          id: 'b', color: CardColor.Yellow, difficulty: CardDifficulty.Hard, ongoing: true,
        },
        {
          id: 'y', color: CardColor.Yellow, difficulty: CardDifficulty.Normal, ongoing: false,
        },
        {
          id: 'z', color: CardColor.Yellow, difficulty: CardDifficulty.Easy, ongoing: false,
        },
      ],
      difficulty: { type: DifficultyType.Easy },
      discard: [
        {
          id: 'd', color: CardColor.Blue, difficulty: CardDifficulty.Hard, ongoing: true,
        },
      ],
      active: [
        {
          id: 'e', color: CardColor.Blue, difficulty: CardDifficulty.Hard, ongoing: true,
        },
        {
          id: 'f', color: CardColor.Blue, difficulty: CardDifficulty.Hard, ongoing: false,
        },
      ],
      stages: [
        mockBox([[CardColor.Yellow, CardDifficulty.Hard]]),
      ],
      counts: [],
    };

    const hoped = deckReducer(input, { type: DeckActionType.AbandonHope });
    expect(hoped.box.map((c) => c.id)).toEqual(['a', 'b']);
    expect(hoped.discard.map((c) => c.id)).toEqual(['d', 'f']);
    expect(hoped.active.map((c) => c.id).sort()).toEqual(['e', 'x', 'y', 'z']);
    expect(hoped.stages).toEqual(input.stages);
  });
});

describe('DeckAction.LostToTime', () => {
  it('works', () => {
    const input: Deck = {
      box: [],
      difficulty: { type: DifficultyType.Easy },
      discard: [
        {
          id: 'd', color: CardColor.Blue, difficulty: CardDifficulty.Hard, ongoing: true,
        },
      ],
      active: mockBox([[CardColor.Blue, CardDifficulty.Hard]]),
      stages: [
        [],
        mockBox([
          [CardColor.Yellow, CardDifficulty.Hard],
          [CardColor.Green, CardDifficulty.Hard],
        ]),
        mockBox([[CardColor.Green, CardDifficulty.Hard]]),
      ],
      counts: [],
    };

    const lost = deckReducer(input, { type: DeckActionType.LostToTime });
    expect(lost.discard.map((c) => `${c.id}${c.color}`)).toEqual(['d2', '01']);
    expect(lost.active).toEqual(input.active);
    expect(lost.stages.map((s) => s.map((c) => `${c.id}${c.color}`).sort())).toEqual([[], [], ['00', '10']]);
  });

  it('can do nothing', () => {
    const input: Deck = {
      box: [],
      difficulty: { type: DifficultyType.Easy },
      discard: mockBox([[CardColor.Green, CardDifficulty.Hard]]),
      active: mockBox([[CardColor.Blue, CardDifficulty.Hard]]),
      stages: [[], [], []],
      counts: [],
    };

    const lost = deckReducer(input, { type: DeckActionType.LostToTime });
    expect(lost).toEqual(input);
  });
});

describe('DeckAction.PactWithEibon', () => {
  it('works', () => {
    const input: Deck = {
      box: [
        {
          id: 'a', color: CardColor.Green, difficulty: CardDifficulty.Hard, ongoing: true,
        },
        {
          id: 'b', color: CardColor.Yellow, difficulty: CardDifficulty.Hard, ongoing: true,
        },
        {
          id: 'y', color: CardColor.Green, difficulty: CardDifficulty.Normal, ongoing: false,
        },
        {
          id: 'z', color: CardColor.Yellow, difficulty: CardDifficulty.Easy, ongoing: false,
        },
      ],
      difficulty: { type: DifficultyType.Easy },
      discard: [
        {
          id: 'd', color: CardColor.Blue, difficulty: CardDifficulty.Hard, ongoing: true,
        },
      ],
      active: mockBox([[CardColor.Blue, CardDifficulty.Hard]]),
      stages: [
        mockBox([
          [CardColor.Yellow, CardDifficulty.Hard],
          [CardColor.Green, CardDifficulty.Hard],
        ]),
      ],
      counts: [],
    };

    const pact = deckReducer(input, { type: DeckActionType.PactWithEibon });
    expect(pact.box.map((c) => c.id)).toEqual(['a', 'b']);
    expect(pact.discard.length).toEqual(4);
    expect(pact.stages.length).toEqual(3);
    expect(pact.stages[2].length).toEqual(1);
    const discardAndDeck: Card[] = Array.prototype.concat.apply([], [pact.discard, pact.stages[2]]);
    expect(discardAndDeck.map((c) => c.id).sort()).toEqual(['0', '1', 'd', 'y', 'z']);
  });
});

describe('DeckAction.ArbiterOfFate', () => {
  // skipping tests because it's trivial
});

describe('DeckAction.EvilOfOld', () => {
  // skipping tests because it's trivial
});
