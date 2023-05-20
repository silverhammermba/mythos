import { Card, CardColor, CardDifficulty } from '../../types/card';
import { randomChoice } from './choice';

// construct a box using just color/difficulty. card ids match index in the returned array
function mockBox(mocks: [CardColor, CardDifficulty][]): Card[] {
  return mocks.map((mock, index) => ({
    id: `${index}`, color: mock[0], difficulty: mock[1], eldritch: 0, clues: 0, ongoing: false,
  }));
}

function ids(cards: Card[]): string[] {
  return cards.map((card) => card.id);
}

describe('randomChoice', () => {
  it('chooses based only on color', () => {
    const box = mockBox([
      [CardColor.Blue, CardDifficulty.Hard],
      [CardColor.Green, CardDifficulty.Normal],
      [CardColor.Yellow, CardDifficulty.Hard],
      [CardColor.Yellow, CardDifficulty.Normal],
      [CardColor.Green, CardDifficulty.Hard],
      [CardColor.Blue, CardDifficulty.Easy],
      [CardColor.Green, CardDifficulty.Normal],
      [CardColor.Blue, CardDifficulty.Easy],
    ]);

    const blues = randomChoice(box, 2, CardColor.Blue);
    expect(ids(blues)).toEqual(['0', '5']);
    expect(ids(box)).toEqual(['1', '2', '3', '4', '6', '7']);
  });

  it('can under-choose', () => {
    const box = mockBox([
      [CardColor.Green, CardDifficulty.Normal],
      [CardColor.Yellow, CardDifficulty.Hard],
      [CardColor.Yellow, CardDifficulty.Normal],
    ]);
    const originalBox = [...box];

    const blues = randomChoice(box, 2, CardColor.Blue);
    expect(blues).toEqual([]);
    expect(box).toEqual(originalBox);
  });
});
