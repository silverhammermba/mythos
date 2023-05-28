import { currentStage, deckReducer, DeckActionType } from './deck';
import { DifficultyType } from '../../types/difficulty';
import { Deck } from '../../types/deck';
import { ids, mockBox } from './choice.test';
import { CardColor, CardDifficulty } from '../../types/card';

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
      difficulty: { type: DifficultyType.Staged, harderRumors: true },
      discard: [],
      active: [],
      stages: [],
      counts: [1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 4],
    };

    const built = deckReducer(input, { type: DeckActionType.Build, startingRumor: true });
    expect(built.stages.map((s) => ids(s).sort())).toEqual([['0'], ['2'], ['3'], ['1']]);
  });
});
