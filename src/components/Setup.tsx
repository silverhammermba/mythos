import { useState } from 'react';
import AncientOneSelect from './AncientOneSelect';
import ExpansionSelect from './ExpansionSelect';
import content from '../content';

function Setup() {
  const numExpansions = content.length;
  const initialExpansionState = Array(numExpansions).fill(false);
  // base set is selected by default
  initialExpansionState[0] = true;

  const [expansions, setExpansions] = useState<boolean[]>(initialExpansionState);

  const [ancientOne, setAncientOne] = useState<string | undefined>(undefined);

  const ancientOnes = content
    .filter((pack, index) => expansions[index])
    .flatMap((pack) => pack.ancientOnes)
    .map((ao) => ao.name)
    .sort();

  return (
    <div className="setup-component">
      <form>
        <fieldset id="expansions">
          <legend>Expansions</legend>
          {content.map((expansion, index) => {
            if (index === 0) return null;
            return (
              <ExpansionSelect
                key={expansion.name}
                name={expansion.name}
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
      </form>
    </div>
  );
}

export default Setup;
