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
  return (
    <div className="difficulty-slider-component">
      <label htmlFor={`ds-${name}`}>
        <input
          type="range"
          min="0"
          max="100"
          id={`ds-${name}`}
          value={proportion * 100}
          onChange={(event) => onChange(event.currentTarget.valueAsNumber / 100)}
        />
        {` ${Math.floor(adjustedProportion * 100)}% ${name}`}
      </label>
    </div>
  );
}

export default DifficultySlider;
