import { useId } from 'react';

interface DifficultySliderProps {
  name: string,
  proportion: number,
  onChange: (selected: number) => void,
  adjustedProportion: number,
}

function DifficultySlider({
  name,
  proportion,
  onChange,
  adjustedProportion,
}: DifficultySliderProps) {
  const id = useId();

  return (
    <div className="difficulty-slider-component">
      <label htmlFor={id}>
        <input
          type="range"
          min="0"
          max="100"
          id={id}
          value={proportion * 100}
          onChange={(event) => onChange(event.currentTarget.valueAsNumber / 100)}
        />
        {` ${Math.floor(adjustedProportion * 100)}% ${name}`}
      </label>
    </div>
  );
}

export default DifficultySlider;
