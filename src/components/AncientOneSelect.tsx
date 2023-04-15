interface AncientOneSelectProps {
  ancientOnes: string[],
  selected: string | undefined,
  onChange: (selection: string) => void
}

function AncientOneSelect({ ancientOnes, selected, onChange }: AncientOneSelectProps) {
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
