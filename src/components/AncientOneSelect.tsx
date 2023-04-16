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
  const ancientOnes = packs
    .filter((pack, index) => enabledPacks[index])
    .flatMap((pack) => pack.ancientOnes)
    .map((ao) => ao.name)
    .sort();

  // if we're ever somehow selecting a nonexistent AO, re-render
  if (!ancientOnes.includes(selected)) {
    onChange(ancientOnes[0]);
  }

  return (
    <div className="ancient-one-select-component">
      <label htmlFor="ao">
        {'Ancient One '}
        <select id="ao" value={selected} onChange={(event) => onChange(event.currentTarget.value)}>
          {ancientOnes.map((ancientOne) => (
            <option
              key={ancientOne}
              value={ancientOne}
            >
              {ancientOne}
            </option>
          ))}
          <option value="Custom">Custom</option>
        </select>
      </label>
    </div>
  );
}

export default AncientOneSelect;
