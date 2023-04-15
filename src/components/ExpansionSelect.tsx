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
  return (
    <div className="expansion-select-component">
      <label htmlFor={name}>
        {name}
        <input
          id={name}
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
