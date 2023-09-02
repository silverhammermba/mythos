import { remove } from './array';
import { CardColor, CardDifficulty, Card } from '../../types/card';
import { DeckDifficulty, DifficultyType } from '../../types/difficulty';
import { ChoiceFunction } from '../../types/deck';

// choose cards simply based on order in the box
export function randomChoice(
  box: Card[],
  count: number,
  color: CardColor,
): Card[] {
  const drawn = remove(box, count, (card) => card.color === color);
  if (drawn.length < count) {
    // console.warn(`not enough ${CardColor[color]} cards.`);
  }
  return drawn;
}

// prefer choosing non-hard cards if possible
export function noHardChoice(
  box: Card[],
  count: number,
  color: CardColor,
): Card[] {
  const notHard = remove(box, count, (card) => card.color === color
    && card.difficulty !== CardDifficulty.Hard);

  if (notHard.length < count) {
    // console.warn(`not enough non-hard ${CardColor[color]} cards. adding some hard ones`);
  }

  const hard = randomChoice(box, count - notHard.length, color);

  return [...notHard, ...hard];
}

// prefer choosing only normal cards, falling back to random
// N.B. this isn't a difficulty option, but it's useful for other choice functions
export function normalChoice(
  box: Card[],
  count: number,
  color: CardColor,
): Card[] {
  const normal = remove(box, count, (card) => card.color === color
    && card.difficulty === CardDifficulty.Normal);

  if (normal.length < count) {
    // console.warn(`not enough normal ${CardColor[color]} cards. adding some random ones`);
  }

  const nonNormal = randomChoice(box, count - normal.length, color);

  return [...nonNormal, ...normal];
}

// prefer choosing non-easy cards if possible
export function noEasyChoice(
  box: Card[],
  count: number,
  color: CardColor,
): Card[] {
  const notEasy = remove(box, count, (card) => card.color === color
    && card.difficulty !== CardDifficulty.Easy);

  if (notEasy.length < count) {
    // console.warn(`not enough non-easy ${CardColor[color]} cards. adding some easy ones`);
  }

  const easy = randomChoice(box, count - notEasy.length, color);

  return [...notEasy, ...easy];
}

// prefer choosing easy cards, falling back to normal, then hard
export function easyChoice(
  box: Card[],
  count: number,
  color: CardColor,
): Card[] {
  const easy = remove(box, count, (card) => card.color === color
    && card.difficulty === CardDifficulty.Easy);

  if (easy.length < count) {
    // console.warn(`not enough easy ${CardColor[color]} cards. adding some normal ones`);
  }

  const normal = remove(box, count - easy.length, (card) => card.color === color
    && card.difficulty === CardDifficulty.Normal);

  if (easy.length + normal.length < count) {
    // console.warn(`not enough normal ${CardColor[color]} cards. adding some hard ones`);
  }

  const hard = randomChoice(box, count - easy.length - normal.length, color);

  return [...easy, ...normal, ...hard];
}

// prefer choosing hard cards, falling back to normal, then easy
export function hardChoice(
  box: Card[],
  count: number,
  color: CardColor,
): Card[] {
  const hard = remove(box, count, (card) => card.color === color
    && card.difficulty === CardDifficulty.Hard);

  if (hard.length < count) {
    // console.warn(`not enough hard ${CardColor[color]} cards. adding some normal ones`);
  }

  const normal = remove(box, count - hard.length, (card) => card.color === color
    && card.difficulty === CardDifficulty.Normal);

  if (hard.length + normal.length < count) {
    // console.warn(`not enough normal ${CardColor[color]} cards. adding some easy ones`);
  }

  const easy = randomChoice(box, count - hard.length - normal.length, color);

  return [...easy, ...normal, ...hard];
}

// return a choice function that chooses card difficulty based on stage
export function stagedChoice(
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
export function customChoice(
  easy: number,
  normal: number,
  hard: number,
): ChoiceFunction {
  const total = Math.max(easy + normal + hard, 0);
  const minNormal = total === 0 ? 1 / 3 : Math.max(easy, 0) / total;
  const minHard = total === 0 ? 2 / 3 : Math.max(easy + normal, 0) / total;

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

export function choose(
  difficulty: DeckDifficulty,
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
