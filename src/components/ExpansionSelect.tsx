interface ExpansionSelectProp {
  name: string,
  abbr: string,
  selected: boolean,
  onChange: (selected: boolean) => void
}

function ExpansionSelect({
  name,
  abbr,
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
          value={abbr}
          checked={selected}
          onChange={(event) => onChange(event.currentTarget.checked)}
        />
      </label>
    </div>
  );
}

export default ExpansionSelect;
