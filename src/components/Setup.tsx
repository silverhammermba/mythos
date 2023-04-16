import { useState } from 'react';
import { difficulties, packs } from '../content';
import AllExpansionSelect from './AllExpansionSelect';
import AncientOneSelect from './AncientOneSelect';
import DeckCountSelect from './DeckCountSelect';
import DifficultySelect from './DifficultySelect';
import PreludeSelect from './PreludeSelect';
import CustomDifficulty from './CustomDifficulty';

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
  const [startingRumor, setStartingRumor] = useState(false);
  const [customDifficulty, setCustomDifficulty] = useState([1, 1, 1]);

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
        <div id="srcb">
          <label htmlFor="strm">
            <input
              type="checkbox"
              id="strm"
              name="startingrumor"
              checked={startingRumor}
              onChange={(event) => setStartingRumor(event.currentTarget.checked)}
            />
            {' Starting rumor'}
          </label>
        </div>
        {ancientOne === 'Custom' && <DeckCountSelect deckCount={customDeckCount} onChange={setCustomDeckCount} />}
        {difficulty === 'Custom' && <CustomDifficulty customDifficulty={customDifficulty} setCustomDifficulty={setCustomDifficulty} />}
      </form>
    </div>
  );
}

export default Setup;
