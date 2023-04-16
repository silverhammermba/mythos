import { useEffect, useId } from 'react';
import { packs } from '../content';

interface AncientOneSelectProps {
  enabledPacks: boolean[],
  selected: string,
  onChange: (selection: string) => void
}

function AncientOneSelect({
  enabledPacks,
  selected,
  onChange,
}: AncientOneSelectProps) {
  const id = useId();

  const ancientOnes = packs
    .filter((pack, index) => enabledPacks[index])
    .flatMap((pack) => pack.ancientOnes)
    .map((ao) => ao.name)
    .sort();
  ancientOnes.push('Custom');

  useEffect(() => {
    // if we're ever somehow selecting a nonexistent AO, re-render
    if (!selected || !ancientOnes.includes(selected)) {
      onChange(ancientOnes[0]);
    }
  }, [ancientOnes, enabledPacks, selected, onChange]);

  return (
    <div className="ancient-one-select-component">
      <label htmlFor={id}>
        {'Ancient One '}
        <select id={id} onChange={(event) => onChange(event.currentTarget.value)}>
          {ancientOnes.map((ancientOne) => (
            <option
              key={ancientOne}
              value={ancientOne}
            >
              {ancientOne}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

export default AncientOneSelect;
