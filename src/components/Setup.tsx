import { useState } from 'react';
import ExpansionSelect from './ExpansionSelect';
import content from '../content';

function Setup() {
  const numExpansions = content.length;
  const initialExpansionState = Array(numExpansions).fill(false);

  const [expansionState, setExpansionState] = useState(initialExpansionState);

  return (
    <div className="setup-component">
      <form>
        <fieldset id="expansions">
          <legend>Expansions</legend>
          {content.map((expansion, index) => (
            <ExpansionSelect
              key={expansion.name}
              name={expansion.name}
              selected={expansionState[index]}
              onChange={(selected) => setExpansionState((prev) => {
                const newSelection = [...prev];
                newSelection[index] = selected;
                return newSelection;
              })}
            />
          ))}
        </fieldset>
      </form>
    </div>
  );
}

export default Setup;
