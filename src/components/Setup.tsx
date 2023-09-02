import { Dispatch, useState } from 'react';
import { DeckAction, DeckActionType } from './reducers/deck';
import {
  Difficulty,
  Prelude,
  difficulties,
  packs,
} from '../content';
import { Deck } from '../types/deck';
import AllExpansionSelect from './AllExpansionSelect';
import AncientOneSelect from './AncientOneSelect';
import DeckCountSelect from './DeckCountSelect';
import DifficultySelect from './DifficultySelect';
import PreludeSelect from './PreludeSelect';
import CustomDifficulty from './CustomDifficulty';
import StartingRumor from './StartingRumor';
import { DeckDifficulty, DifficultyType } from '../types/difficulty';
import { Card, buildCard } from '../types/card';
import { remove } from './reducers/array';

export function buildDifficulty(
  difficulty: Difficulty,
  customDifficulty: number[],
): DeckDifficulty {
  switch (difficulty.type) {
    case DifficultyType.Random:
      return { type: DifficultyType.Random };
    case DifficultyType.NoHard:
      return { type: DifficultyType.NoHard };
    case DifficultyType.NoEasy:
      return { type: DifficultyType.NoEasy };
    case DifficultyType.Easy:
      return { type: DifficultyType.Easy };
    case DifficultyType.Hard:
      return { type: DifficultyType.Hard };
    case DifficultyType.Staged:
      return { type: DifficultyType.Staged, harderRumors: difficulty.name.includes('Hard') };
    case DifficultyType.Custom:
      return {
        type: DifficultyType.Custom,
        easy: customDifficulty[0],
        normal: customDifficulty[1],
        hard: customDifficulty[2],
      };
    default:
      throw new Error(`unhandled difficulty type ${difficulty.type}`);
  }
}

export function buildCounts(
  ancientOneName: string,
  customCounts: number[],
): number[] {
  if (ancientOneName === 'Custom') {
    return customCounts;
  }
  for (let i = 0; i < packs.length; i += 1) {
    for (let j = 0; j < packs[i].ancientOnes.length; j += 1) {
      const ao = packs[i].ancientOnes[j];
      if (ao.name === ancientOneName) {
        return ao.deck;
      }
    }
  }
  throw new Error(`unknown ancient one ${ancientOneName}`);
}

export function getPrelude(name: String): Prelude | undefined {
  for (let i = 0; i < packs.length; i += 1) {
    for (let j = 0; j < packs[i].preludes.length; j += 1) {
      const prelude = packs[i].preludes[j];
      if (prelude.name === name) return prelude;
    }
  }
  return undefined;
}

interface SetupProp {
  deck: Deck,
  dispatch: Dispatch<DeckAction>,
}

function Setup({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  deck,
  dispatch,
}: SetupProp) {
  const [enabledPacks, setEnabledPacks] = useState(
    // base pack is selected by default
    Array.from({ length: packs.length }, (_, index) => index === 0),
  );
  const [ancientOne, setAncientOne] = useState<string>('');
  const [prelude, setPrelude] = useState<string>('');
  const [difficulty, setDifficulty] = useState(difficulties[0]);
  // use strings for custom deck counts to allow invalid input (we validate later)
  const [customDeckTmp, setCustomDeckTmp] = useState(Array<string>(9).fill(''));
  const [startingRumor, setStartingRumor] = useState(false);
  const [customDifficulty, setCustomDifficulty] = useState([1, 1, 1]);

  const customDeckCount = customDeckTmp.map((count) => {
    if (count === '') return 0;
    return Number.parseInt(count, 10);
  });
  const customDeckValid = customDeckCount.every((count) => {
    const valid = !Number.isNaN(count) && Number.isInteger(count) && count >= 0;
    return valid;
  }) && customDeckCount.find((count) => count > 0);
  const ancientOneValid = Boolean(ancientOne) && (ancientOne !== 'Custom' || customDeckValid);

  const startGame: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    const box = packs
      .filter((pack, index) => enabledPacks[index])
      .flatMap((pack) => pack.cards)
      .map((code) => buildCard(code));

    const active: Card[] = [];

    const pre = getPrelude(prelude);
    if (pre) {
      const card = remove(box, 1, (c) => c.id === pre.card)[0];
      if (ancientOne !== pre.notAllowedWith) {
        active.push({ ...card, eldritch: pre.tokens });
      }
    }

    dispatch({
      type: DeckActionType.Build,
      active,
      box,
      difficulty: buildDifficulty(difficulty ?? difficulties[0], customDifficulty),
      counts: buildCounts(ancientOne, customDeckCount),
      startingRumor,
    });
  };

  return (
    <div className="setup-component">
      <form onSubmit={startGame}>
        <AllExpansionSelect
          enabledPacks={enabledPacks}
          setEnabledPacks={setEnabledPacks}
        />
        <AncientOneSelect
          enabledPacks={enabledPacks}
          selected={ancientOne}
          onChange={setAncientOne}
        />
        {ancientOne === 'Custom' && <DeckCountSelect deckCount={customDeckTmp} onChange={setCustomDeckTmp} />}
        <DifficultySelect selected={difficulty} onChange={setDifficulty} />
        <PreludeSelect enabledPacks={enabledPacks} selected={prelude} onChange={setPrelude} />
        <StartingRumor selected={startingRumor} onChange={setStartingRumor} />
        {difficulty.name === 'Custom' && <CustomDifficulty customDifficulty={customDifficulty} setCustomDifficulty={setCustomDifficulty} />}
        <button type="submit" disabled={!ancientOneValid}>
          Start Game
        </button>
      </form>
    </div>
  );
}

export default Setup;
