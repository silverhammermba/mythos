import { useState } from 'react';
import { difficulties, packs } from '../content';
import AllExpansionSelect from './AllExpansionSelect';
import AncientOneSelect from './AncientOneSelect';
import DeckCountSelect from './DeckCountSelect';
import DifficultySelect from './DifficultySelect';
import PreludeSelect from './PreludeSelect';
import CustomDifficulty from './CustomDifficulty';
import StartingRumor from './StartingRumor';

function Setup() {
  const [enabledPacks, setEnabledPacks] = useState(
    // base pack is selected by default
    Array.from({ length: packs.length }, (_, index) => index === 0),
  );
  const [ancientOne, setAncientOne] = useState<string>('');
  const [prelude, setPrelude] = useState<string>('');
  const [difficulty, setDifficulty] = useState(difficulties[0].name);
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
    console.log('starting game!');
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
        <DifficultySelect selected={difficulty} onChange={setDifficulty} />
        <PreludeSelect enabledPacks={enabledPacks} selected={prelude} onChange={setPrelude} />
        <StartingRumor selected={startingRumor} onChange={setStartingRumor} />
        {ancientOne === 'Custom' && <DeckCountSelect deckCount={customDeckTmp} onChange={setCustomDeckTmp} />}
        {difficulty === 'Custom' && <CustomDifficulty customDifficulty={customDifficulty} setCustomDifficulty={setCustomDifficulty} />}
        <button type="submit" disabled={!ancientOneValid}>
          Start Game
        </button>
      </form>
    </div>
  );
}

export default Setup;
