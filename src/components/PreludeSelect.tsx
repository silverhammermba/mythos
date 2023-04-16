import { useEffect, useId } from 'react';
import { packs } from '../content';

interface PreludeSelectProps {
  enabledPacks: boolean[],
  selected: string,
  onChange: (selection: string) => void
}

function PreludeSelect({
  enabledPacks,
  selected,
  onChange,
}: PreludeSelectProps) {
  const id = useId();

  const preludes = packs
    .filter((pack, index) => enabledPacks[index])
    .flatMap((pack) => pack.preludes)
    .map((prelude) => prelude.name)
    .sort();

  useEffect(() => {
    // if we're ever selecting a nonexistent prelude, re-render
    if (preludes.length > 0 && selected && !preludes.includes(selected)) {
      onChange('');
    }
  }, [preludes, selected, onChange]);

  return preludes.length > 0 ? (
    <div className="prelude-select-component">
      <label htmlFor={id}>
        {'Prelude '}
        <select id={id} value={selected} onChange={(event) => onChange(event.currentTarget.value)}>
          {preludes.map((prelude) => (
            <option
              key={prelude}
              value={prelude}
            >
              {prelude}
            </option>
          ))}
          <option value="">Other</option>
        </select>
      </label>
    </div>
  ) : null;
}

export default PreludeSelect;
