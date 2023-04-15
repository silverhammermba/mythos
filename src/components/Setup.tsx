import { useState } from 'react';
import ExpansionSelect from './ExpansionSelect';

function Setup() {
  const expansions = [
    { name: 'Forsaken Lore', abbr: 'L', state: useState(false) },
    { name: 'Mountains of Madness', abbr: 'M', state: useState(false) },
    { name: 'Strange Remnants', abbr: 'R', state: useState(false) },
    { name: 'Under the Pyramids', abbr: 'P', state: useState(false) },
    { name: 'Signs of Carcosa', abbr: 'C', state: useState(false) },
    { name: 'The Dreamlands', abbr: 'D', state: useState(false) },
    { name: 'Cities in Ruin', abbr: 'S', state: useState(false) },
    { name: 'Masks of Nyarlathotep', abbr: 'N', state: useState(false) },
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
