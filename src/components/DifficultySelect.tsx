import { useId } from 'react';
import { difficulties } from '../content';

interface DifficultySelectProps {
  selected: string | undefined,
  onChange: (selection: string) => void,
}

function DifficultySelect({ selected, onChange }: DifficultySelectProps) {
  const id = useId();

  const current = difficulties.find((difficulty) => difficulty.name === selected);

  return (
    <div className="difficulty-select-component">
      <label htmlFor={id}>
        {'Deck building method '}
        <select
          id={id}
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
