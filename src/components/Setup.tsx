import { useState } from 'react';
import { difficulties, packs } from '../content';
import AllExpansionSelect from './AllExpansionSelect';
import AncientOneSelect from './AncientOneSelect';
import DeckCountSelect from './DeckCountSelect';
import DifficultySelect from './DifficultySelect';

function Setup() {
  const numExpansions = packs.length;
  const initialPackState: boolean[] = Array(numExpansions).fill(false);
  // base pack is selected by default
  initialPackState[0] = true;

  const initialCustomDeckCount = Array<number>(9).fill(0);

  const [enabledPacks, setEnabledPacks] = useState(initialPackState);

  const ancientOnes = packs
    .filter((pack, index) => enabledPacks[index])
    .flatMap((pack) => pack.ancientOnes)
    .map((ao) => ao.name)
    .sort();

  const [ancientOne, setAncientOne] = useState(ancientOnes[0]);
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
          ancientOnes={ancientOnes}
          selected={ancientOne}
          onChange={setAncientOne}
        />
        <DifficultySelect selected={difficulty} onChange={setDifficulty} />
        <DeckCountSelect deckCount={customDeckCount} onChange={setCustomDeckCount} />
      </form>
    </div>
  );
}

export default Setup;
