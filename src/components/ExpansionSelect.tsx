import { useId } from 'react';

interface ExpansionSelectProp {
  name: string,
  selected: boolean,
  onChange: (selected: boolean) => void
}

function ExpansionSelect({
  name,
  selected,
  onChange,
}: ExpansionSelectProp) {
  const id = useId();

  return (
    <div className="expansion-select-component">
      <label htmlFor={id}>
        {`${name} `}
        <input
          id={id}
          type="checkbox"
          name="expansion"
          checked={selected}
          onChange={(event) => onChange(event.currentTarget.checked)}
        />
      </label>
    </div>
  );
}

export default ExpansionSelect;
