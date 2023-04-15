import { useState } from 'react';
import AncientOneSelect from './AncientOneSelect';
import ExpansionSelect from './ExpansionSelect';
import { packs } from '../content';
import DeckCountSelect from './DeckCountSelect';
import DifficultySelect from './DifficultySelect';

function Setup() {
  const numExpansions = packs.length;
  const initialExpansionState: boolean[] = Array(numExpansions).fill(false);
  // base pack is selected by default
  initialExpansionState[0] = true;

  const initialCustomDeckCount = Array<number>(9).fill(0);

  const [expansions, setExpansions] = useState(initialExpansionState);
  const [ancientOne, setAncientOne] = useState<string | undefined>(undefined);
  const [difficulty, setDifficulty] = useState<string | undefined>(undefined);
  const [customDeckCount, setCustomDeckCount] = useState(initialCustomDeckCount);

  const ancientOnes = packs
    .filter((pack, index) => expansions[index])
    .flatMap((pack) => pack.ancientOnes)
    .map((ao) => ao.name)
    .sort();

  return (
    <div className="setup-component">
      <form>
        <fieldset id="expansions">
          <legend>Expansions</legend>
          {packs.map((pack, index) => {
            if (index === 0) return null;
            return (
              <ExpansionSelect
                key={pack.name}
                name={pack.name}
                selected={expansions[index]}
                onChange={(selected: boolean) => {
                  setExpansions((prev) => {
                    const newSelection = [...prev];
                    newSelection[index] = selected;
                    newSelection[0] = true; // never deselect base set
                    return newSelection;
                  });
                }}
              />
            );
          })}
        </fieldset>
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
