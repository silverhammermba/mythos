import { difficulties } from '../content';

interface DifficultySelectProps {
  selected: string | undefined,
  onChange: (selection: string) => void,
}

function DifficultySelect({ selected, onChange }: DifficultySelectProps) {
  const current = difficulties.find((difficulty) => difficulty.name === selected);

  return (
    <div className="difficulty-select-component">
      <label htmlFor="difficulty-select">
        {'Deck building method '}
        <select
          className="difficulty-select-component"
          value={selected}
          onChange={(event) => onChange(event.currentTarget.value)}
        >
          {difficulties.map((difficulty) => (
            <option
              key={difficulty.name}
              value={difficulty.name}
            >
              {difficulty.name}
            </option>
          ))}
        </select>
      </label>
      {current?.description && (
        <p>
          {current.description}
        </p>
      )}
    </div>
  );
}

export default DifficultySelect;
