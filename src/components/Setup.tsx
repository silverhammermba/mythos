import { Dispatch, useState } from 'react';
import { DeckAction, DeckActionType } from './reducers/deck';
import { Difficulty, difficulties, packs } from '../content';
import { Deck } from '../types/deck';
import AllExpansionSelect from './AllExpansionSelect';
import AncientOneSelect from './AncientOneSelect';
import DeckCountSelect from './DeckCountSelect';
import DifficultySelect from './DifficultySelect';
import PreludeSelect from './PreludeSelect';
import CustomDifficulty from './CustomDifficulty';
import StartingRumor from './StartingRumor';
import { DeckDifficulty, DifficultyType } from '../types/difficulty';

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
      console.error(`unhandled difficulty type ${difficulty.type}`);
      return { type: DifficultyType.Random };
  }
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

    dispatch({
      type: DeckActionType.Build,
      active: [], // TODO: get prelude card,
      box: [], // TODO: load cards
      difficulty: buildDifficulty(difficulty ?? difficulties[0], customDifficulty),
      counts: [], // TODO: get counts from AO data
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
