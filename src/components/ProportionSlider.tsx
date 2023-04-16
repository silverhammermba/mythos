import { useId } from 'react';

interface ProportionSliderProps {
  proportion: number,
  onChange: (selected: number) => void,
  children: string,
}

function ProportionSlider({
  proportion,
  onChange,
  children,
}: ProportionSliderProps) {
  const id = useId();

  return (
    <div className="proportion-slider-component">
      <label htmlFor={id}>
        <input
          type="range"
          min="0"
          max="100"
          id={id}
          value={proportion * 100}
          onChange={(event) => onChange(event.currentTarget.valueAsNumber / 100)}
        />
        {` ${children}`}
      </label>
    </div>
  );
}

export default ProportionSlider;
