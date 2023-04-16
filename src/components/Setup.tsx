import { useState } from 'react';
import { difficulties, packs } from '../content';
import AllExpansionSelect from './AllExpansionSelect';
import AncientOneSelect from './AncientOneSelect';
import DeckCountSelect from './DeckCountSelect';
import DifficultySelect from './DifficultySelect';
import PreludeSelect from './PreludeSelect';

function Setup() {
  const initialPackState: boolean[] = Array(packs.length).fill(false);
  // base pack is selected by default
  initialPackState[0] = true;

  const initialCustomDeckCount = Array<number>(9).fill(0);

  const [enabledPacks, setEnabledPacks] = useState(initialPackState);

  const [ancientOne, setAncientOne] = useState<string>('');
  const [prelude, setPrelude] = useState<string>('');
  const [difficulty, setDifficulty] = useState(difficulties[0].name);
  const [customDeckCount, setCustomDeckCount] = useState(initialCustomDeckCount);

  return (
    <div className="setup-component">
      <form>
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
        {ancientOne === 'Custom' && <DeckCountSelect deckCount={customDeckCount} onChange={setCustomDeckCount} />}
      </form>
    </div>
  );
}

export default Setup;
