import { useState } from 'react';
import ExpansionSelect from './ExpansionSelect';

function Setup() {
  const expansions = [
    { name: 'Forsaken Lore', abbr: 'L', state: useState(false) },
    { name: 'Mountains of Madness', abbr: 'M', state: useState(false) },
  ];

  return (
    <div className="setup-component">
      <form>
        <fieldset id="expansions">
          <legend>Expansions</legend>
          {expansions.map((expansion) => (
            <ExpansionSelect
              key={expansion.name}
              name={expansion.name}
              abbr={expansion.abbr}
              selected={expansion.state[0]}
              onChange={expansion.state[1]}
            />
          ))}
        </fieldset>
      </form>
    </div>
  );
}

export default Setup;
