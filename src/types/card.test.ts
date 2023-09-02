import { CardColor, CardDifficulty, buildCard } from './card';
import { packs } from '../content';

describe('buildCard', () => {
  it('works on all cards', () => {
    packs.forEach((pack) => {
      pack.cards.forEach((card) => buildCard(card));
    });
  });

  it('throws on invalid color', () => {
    expect(() => buildCard('purp-13-EB3')).toThrow();
  });

  it('throws on invalid difficulty', () => {
    expect(() => buildCard('blue-13-JB3')).toThrow();
  });

  it('preserves all necessary data', () => {
    const maximum = 'blue-13-EB3c';
    expect(buildCard(maximum)).toEqual({
      id: maximum,
      color: CardColor.Blue,
      difficulty: CardDifficulty.Easy,
      eldritch: 3,
      clues: 0,
      ongoing: true,
    });

    const minimum = 'gren-0-HZ';
    expect(buildCard(minimum)).toEqual({
      id: minimum,
      color: CardColor.Green,
      difficulty: CardDifficulty.Hard,
      ongoing: false,
    });
  });

  it('handles ongoing corner cases', () => {
    const eldritch = 'gren-13-HZ9';
    expect(buildCard(eldritch)).toEqual({
      id: eldritch,
      color: CardColor.Green,
      difficulty: CardDifficulty.Hard,
      eldritch: 9,
      ongoing: true,
    });

    const ongoing = 'gren-13-HZ-';
    expect(buildCard(ongoing)).toEqual({
      id: ongoing,
      color: CardColor.Green,
      difficulty: CardDifficulty.Hard,
      ongoing: true,
    });

    const clues = 'gren-13-HZc';
    expect(buildCard(clues)).toEqual({
      id: clues,
      color: CardColor.Green,
      difficulty: CardDifficulty.Hard,
      clues: 0,
      ongoing: true,
    });
  });
});
