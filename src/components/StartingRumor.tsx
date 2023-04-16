import { useId } from 'react';

interface StartingRumorProps {
  selected: boolean,
  onChange: (selected: boolean) => void,
}

function StartingRumor({ selected, onChange }: StartingRumorProps) {
  const id = useId();

  return (
    <div className="starting-rumor-component">
      <label htmlFor={id}>
        <input
          type="checkbox"
          id={id}
          checked={selected}
          onChange={(event) => onChange(event.currentTarget.checked)}
        />
        {' Starting rumor'}
      </label>
    </div>
  );
}

export default StartingRumor;
