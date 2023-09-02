export enum CardColor {
  Green,
  Yellow,
  Blue,
}

export enum CardDifficulty {
  Easy,
  Normal,
  Hard,
}

export interface Card {
  id: string,
  color: CardColor,
  difficulty: CardDifficulty,
  eldritch?: number,
  clues?: number,
  ongoing: boolean,
}

function buildColor(code: String): CardColor {
  switch (code) {
    case 'blue':
      return CardColor.Blue;
    case 'yelw':
      return CardColor.Yellow;
    case 'gren':
      return CardColor.Green;
    default:
      throw new Error(`invalid card color ${code}`);
  }
}

function buildDifficulty(code: String): CardDifficulty {
  switch (code) {
    case 'E':
      return CardDifficulty.Easy;
    case 'N':
      return CardDifficulty.Normal;
    case 'H':
      return CardDifficulty.Hard;
    default:
      throw new Error(`invalid card difficulty ${code}`);
  }
}

export function buildCard(code: string): Card {
  const cardPattern = /^(blue|yelw|gren)-\d+-([ENH])[A-Z]([0-9-])?(c)?/;

  const match = code.match(cardPattern);
  if (!match) throw new Error(`invalid card ${code}`);

  const eldritch = (match[3] && match[3] !== '-') ? Number.parseInt(match[3], 10) : undefined;
  const clues = match[4] ? 0 : undefined;

  return {
    id: code,
    color: buildColor(match[1]),
    difficulty: buildDifficulty(match[2]),
    eldritch,
    clues,
    ongoing: (!!match[3] || !!match[4]),
  };
}
