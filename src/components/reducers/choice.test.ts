import { Card, CardColor, CardDifficulty } from '../../types/card';
import { ChoiceFunction } from '../../types/deck';
import {
  randomChoice,
  noHardChoice,
  normalChoice,
  noEasyChoice,
  easyChoice,
  hardChoice,
  stagedChoice,
  customChoice,
} from './choice';

// construct a box using just color/difficulty. card ids match index in the returned array
function mockBox(mocks: [CardColor, CardDifficulty][]): Card[] {
  return mocks.map((mock, index) => ({
    id: `${index}`, color: mock[0], difficulty: mock[1], eldritch: 0, clues: 0, ongoing: false,
  }));
}

function ids(cards: Card[]): string[] {
  return cards.map((card) => card.id);
}

const bigBox = mockBox([
  [CardColor.Blue, CardDifficulty.Hard], //     0
  [CardColor.Green, CardDifficulty.Easy], //    1
  [CardColor.Yellow, CardDifficulty.Hard], //   2
  [CardColor.Yellow, CardDifficulty.Normal], // 3
  [CardColor.Green, CardDifficulty.Hard], //    4
  [CardColor.Blue, CardDifficulty.Normal], //   5
  [CardColor.Green, CardDifficulty.Normal], //  6
  [CardColor.Blue, CardDifficulty.Easy], //     7
]);

describe('all choice functions', () => {
  it('preserve cards', () => {
    const cases: [ChoiceFunction, number, CardColor][] = [
      [randomChoice, 2, CardColor.Blue],
      [noHardChoice, 2, CardColor.Green],
      [normalChoice, 2, CardColor.Green],
      [noEasyChoice, 2, CardColor.Green],
      [easyChoice, 2, CardColor.Green],
      [hardChoice, 2, CardColor.Green],
      [stagedChoice(false), 2, CardColor.Green],
      [stagedChoice(true), 2, CardColor.Green],
      [customChoice(1, 0, 0), 2, CardColor.Green],
      [customChoice(0, 1, 0), 2, CardColor.Green],
      [customChoice(0, 0, 1), 2, CardColor.Green],
      [customChoice(1, 2, 1), 2, CardColor.Green],
    ];

    for (let i = 0; i < cases.length; i += 1) {
      const testBox = [...bigBox];
      const result = cases[i][0](testBox, cases[i][1], cases[i][2]);
      // should have chosen some, but not all cards
      expect(result.length).toBeGreaterThan(0);
      expect(testBox.length).toBeGreaterThan(0);
      // all cards should still exist somewhere
      const total = ids(result).concat(ids(testBox)).sort();
      expect(total).toEqual(['0', '1', '2', '3', '4', '5', '6', '7']);
    }
  });

  it('will choose all possible cards of the given color if needed', () => {
    const cases = [
      randomChoice,
      noHardChoice,
      normalChoice,
      noEasyChoice,
      easyChoice,
      hardChoice,
      stagedChoice(false),
      stagedChoice(true),
      customChoice(1, 0, 0),
      customChoice(0, 1, 0),
      customChoice(0, 0, 1),
      customChoice(1, 2, 1),
    ];

    for (let i = 0; i < cases.length; i += 1) {
      const testBox = [...bigBox];
      const blues = cases[i](testBox, 8, CardColor.Blue);
      const greens = cases[i](testBox, 8, CardColor.Green);
      const yellows = cases[i](testBox, 8, CardColor.Yellow);

      // should have chosen all cards
      expect(blues.map((c) => c.color)).toEqual([
        CardColor.Blue, CardColor.Blue, CardColor.Blue,
      ]);
      expect(greens.map((c) => c.color)).toEqual([
        CardColor.Green, CardColor.Green, CardColor.Green,
      ]);
      expect(yellows.map((c) => c.color)).toEqual([
        CardColor.Yellow, CardColor.Yellow,
      ]);
      expect(testBox).toEqual([]);
      const total = ids(blues).concat(ids(greens)).concat(ids(yellows)).sort();
      expect(total).toEqual(['0', '1', '2', '3', '4', '5', '6', '7']);
    }
  });
});

describe('randomChoice', () => {
  it('chooses based only on color', () => {
    const box = [...bigBox];
    const blues = randomChoice(box, 2, CardColor.Blue);
    expect(ids(blues)).toEqual(['0', '5']);
  });
});

describe('noHardChoice', () => {
  it('chooses non-hard first', () => {
    const box = mockBox([
      [CardColor.Green, CardDifficulty.Hard],
      [CardColor.Green, CardDifficulty.Easy],
      [CardColor.Green, CardDifficulty.Normal],
    ]);

    const first = noHardChoice(box, 2, CardColor.Green);
    const second = noHardChoice(box, 1, CardColor.Green);
    expect(ids(first)).toEqual(['1', '2']);
    expect(ids(second)).toEqual(['0']);
  });
});

describe('normalChoice', () => {
  it('chooses normal first', () => {
    const box = mockBox([
      [CardColor.Blue, CardDifficulty.Hard],
      [CardColor.Blue, CardDifficulty.Easy],
      [CardColor.Blue, CardDifficulty.Normal],
    ]);

    const first = normalChoice(box, 1, CardColor.Blue);
    const second = normalChoice(box, 2, CardColor.Blue);
    expect(ids(first)).toEqual(['2']);
    expect(ids(second)).toEqual(['0', '1']);
  });
});

describe('noEasyChoice', () => {
  it('chooses non-easy first', () => {
    const box = mockBox([
      [CardColor.Blue, CardDifficulty.Easy],
      [CardColor.Blue, CardDifficulty.Hard],
      [CardColor.Blue, CardDifficulty.Normal],
    ]);

    const first = noEasyChoice(box, 2, CardColor.Blue);
    const second = noEasyChoice(box, 1, CardColor.Blue);
    expect(ids(first)).toEqual(['1', '2']);
    expect(ids(second)).toEqual(['0']);
  });
});

describe('easyChoice', () => {
  it('chooses easy then normal then hard', () => {
    const box = mockBox([
      [CardColor.Blue, CardDifficulty.Hard],
      [CardColor.Blue, CardDifficulty.Normal],
      [CardColor.Blue, CardDifficulty.Easy],
    ]);

    const first = easyChoice(box, 1, CardColor.Blue);
    const second = easyChoice(box, 1, CardColor.Blue);
    const third = easyChoice(box, 1, CardColor.Blue);
    expect(ids(first)).toEqual(['2']);
    expect(ids(second)).toEqual(['1']);
    expect(ids(third)).toEqual(['0']);
  });
});

describe('hardChoice', () => {
  it('chooses hard then normal then easy', () => {
    const box = mockBox([
      [CardColor.Blue, CardDifficulty.Easy],
      [CardColor.Blue, CardDifficulty.Normal],
      [CardColor.Blue, CardDifficulty.Hard],
    ]);

    const first = hardChoice(box, 1, CardColor.Blue);
    const second = hardChoice(box, 1, CardColor.Blue);
    const third = hardChoice(box, 1, CardColor.Blue);
    expect(ids(first)).toEqual(['2']);
    expect(ids(second)).toEqual(['1']);
    expect(ids(third)).toEqual(['0']);
  });
});

describe('stagedChoice', () => {
  it('chooses based on stage (easy rumors)', () => {
    const box = mockBox([
      [CardColor.Green, CardDifficulty.Normal], //  0
      [CardColor.Green, CardDifficulty.Easy], //    1
      [CardColor.Blue, CardDifficulty.Hard], //     2
      [CardColor.Blue, CardDifficulty.Easy], //     3
      [CardColor.Green, CardDifficulty.Hard], //    4
      [CardColor.Green, CardDifficulty.Normal], //  5
      [CardColor.Green, CardDifficulty.Easy], //    6
      [CardColor.Yellow, CardDifficulty.Easy], //   7
      [CardColor.Yellow, CardDifficulty.Hard], //   8
      [CardColor.Yellow, CardDifficulty.Normal], // 9
      [CardColor.Blue, CardDifficulty.Easy], //    10
      [CardColor.Blue, CardDifficulty.Normal], //  11
      [CardColor.Blue, CardDifficulty.Hard], //    12
    ]);

    const choice = stagedChoice(false);

    // without stage, picks randomly
    const first = choice(box, 2, CardColor.Green);
    const second = choice(box, 2, CardColor.Blue);
    expect(ids(first)).toEqual(['0', '1']);
    expect(ids(second)).toEqual(['2', '3']);

    // stage 0 should prefer easy then normal then hard
    const stage01 = choice(box, 1, CardColor.Green, 0);
    const stage02 = choice(box, 1, CardColor.Green, 0);
    const stage03 = choice(box, 1, CardColor.Green, 0);
    expect(ids(stage01)).toEqual(['6']);
    expect(ids(stage02)).toEqual(['5']);
    expect(ids(stage03)).toEqual(['4']);

    // stage 1 should prefer normal then random
    const stage11 = choice(box, 1, CardColor.Yellow, 1);
    const stage12 = choice(box, 2, CardColor.Yellow, 1);
    expect(ids(stage11)).toEqual(['9']);
    expect(ids(stage12)).toEqual(['7', '8']);

    // stage 2 should prefer hard then normal then easy
    const stage21 = choice(box, 1, CardColor.Blue, 2);
    const stage22 = choice(box, 1, CardColor.Blue, 2);
    const stage23 = choice(box, 1, CardColor.Blue, 2);
    expect(ids(stage21)).toEqual(['12']);
    expect(ids(stage22)).toEqual(['11']);
    expect(ids(stage23)).toEqual(['10']);
  });

  it('chooses based on stage (hard rumors)', () => {
    const box = mockBox([
      [CardColor.Green, CardDifficulty.Normal], //  0
      [CardColor.Green, CardDifficulty.Easy], //    1
      [CardColor.Blue, CardDifficulty.Hard], //     2
      [CardColor.Blue, CardDifficulty.Easy], //     3
      [CardColor.Green, CardDifficulty.Hard], //    4
      [CardColor.Green, CardDifficulty.Normal], //  5
      [CardColor.Green, CardDifficulty.Easy], //    6
      [CardColor.Yellow, CardDifficulty.Hard], //   7
      [CardColor.Yellow, CardDifficulty.Normal], // 8
      [CardColor.Yellow, CardDifficulty.Easy], //   9
      [CardColor.Blue, CardDifficulty.Hard], //    10
      [CardColor.Blue, CardDifficulty.Hard], //    11
      [CardColor.Blue, CardDifficulty.Normal], //  12
      [CardColor.Blue, CardDifficulty.Easy], //    13
    ]);

    const choice = stagedChoice(true);

    // without stage, picks randomly
    const first = choice(box, 2, CardColor.Green);
    const second = choice(box, 2, CardColor.Blue);
    expect(ids(first)).toEqual(['0', '1']);
    expect(ids(second)).toEqual(['2', '3']);

    // green uses easy/normal/hard
    const green1 = choice(box, 1, CardColor.Green, 0);
    const green2 = choice(box, 1, CardColor.Green, 1);
    const green3 = choice(box, 1, CardColor.Green, 2);
    expect(ids(green1)).toEqual(['6']);
    expect(ids(green2)).toEqual(['5']);
    expect(ids(green3)).toEqual(['4']);

    // yellow uses easy/normal/hard
    const yellow1 = choice(box, 1, CardColor.Yellow, 0);
    const yellow2 = choice(box, 1, CardColor.Yellow, 1);
    const yellow3 = choice(box, 1, CardColor.Yellow, 2);
    expect(ids(yellow1)).toEqual(['9']);
    expect(ids(yellow2)).toEqual(['8']);
    expect(ids(yellow3)).toEqual(['7']);

    // blue uses normal/hard
    const blue1 = choice(box, 1, CardColor.Blue, 0);
    const blue2 = choice(box, 1, CardColor.Blue, 1);
    const blue3 = choice(box, 2, CardColor.Blue, 2);
    expect(ids(blue1)).toEqual(['12']);
    expect(ids(blue2)).toEqual(['10']);
    expect(ids(blue3)).toEqual(['13', '11']);
  });
});

describe('customChoice', () => {
  it('can choose easy only', () => {
    const box = mockBox([
      [CardColor.Blue, CardDifficulty.Hard],
      [CardColor.Blue, CardDifficulty.Normal],
      [CardColor.Blue, CardDifficulty.Easy],
    ]);

    const choice = customChoice(1, 0, 0);

    const first = choice(box, 1, CardColor.Blue);
    const second = choice(box, 1, CardColor.Blue);
    const third = choice(box, 1, CardColor.Blue);
    expect(ids(first)).toEqual(['2']);
    expect(ids(second)).toEqual(['1']);
    expect(ids(third)).toEqual(['0']);
  });

  it('can choose normal only', () => {
    const box = mockBox([
      [CardColor.Blue, CardDifficulty.Hard],
      [CardColor.Blue, CardDifficulty.Easy],
      [CardColor.Blue, CardDifficulty.Normal],
    ]);

    const choice = customChoice(0, 1, 0);

    const first = choice(box, 1, CardColor.Blue);
    const second = choice(box, 2, CardColor.Blue);
    expect(ids(first)).toEqual(['2']);
    expect(ids(second)).toEqual(['0', '1']);
  });

  it('can choose hard only', () => {
    const box = mockBox([
      [CardColor.Blue, CardDifficulty.Easy],
      [CardColor.Blue, CardDifficulty.Normal],
      [CardColor.Blue, CardDifficulty.Hard],
    ]);

    const choice = customChoice(0, 0, 1);

    const first = choice(box, 1, CardColor.Blue);
    const second = choice(box, 1, CardColor.Blue);
    const third = choice(box, 1, CardColor.Blue);
    expect(ids(first)).toEqual(['2']);
    expect(ids(second)).toEqual(['1']);
    expect(ids(third)).toEqual(['0']);
  });

  it('can choose randomly', () => {
    const easy = mockBox(
      Array(100).fill(null).map(() => [CardColor.Blue, CardDifficulty.Easy]),
    );
    const normal = mockBox(
      Array(100).fill(null).map(() => [CardColor.Blue, CardDifficulty.Normal]),
    );
    const hard = mockBox(
      Array(100).fill(null).map(() => [CardColor.Blue, CardDifficulty.Hard]),
    );
    // sanity check that mock box was built correctly
    const box = [...easy, ...normal, ...hard];
    expect(box.length).toEqual(300);
    expect(box[0].id).toEqual('0');
    expect(box[299].id).toEqual('99');

    const result = customChoice(1, 2, 1)(box, 100, CardColor.Blue);

    const neasy = result.filter((c) => c.difficulty === CardDifficulty.Easy).length;
    const nnormal = result.filter((c) => c.difficulty === CardDifficulty.Normal).length;
    const nhard = result.filter((c) => c.difficulty === CardDifficulty.Hard).length;

    // probabilistic test. these should be the 99th percentile bounds for each
    expect(neasy).toBeGreaterThan(14);
    expect(neasy).toBeLessThan(35);
    expect(nnormal).toBeGreaterThan(37);
    expect(nnormal).toBeLessThan(63);
    expect(nhard).toBeGreaterThan(14);
    expect(nhard).toBeLessThan(35);
  });
});
