import { useId } from 'react';
import { Difficulty, difficulties } from '../content';

interface DifficultySelectProps {
  selected: Difficulty,
  onChange: (selection: Difficulty) => void,
}

function DifficultySelect({ selected, onChange }: DifficultySelectProps) {
  const id = useId();

  return (
    <div className="difficulty-select-component">
      <label htmlFor={id}>
        {'Deck building method '}
        <select
          id={id}
          value={selected?.name}
          onChange={(event) => onChange(
            difficulties.find(
              (difficulty) => difficulty?.name === event.currentTarget.value,
            ) ?? difficulties[0],
          )}
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
      {selected?.description && (
        <p>
          {selected.description}
        </p>
      )}
    </div>
  );
}

export default DifficultySelect;
