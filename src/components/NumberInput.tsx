interface NumberInputProps {
  className: string,
  value: string,
  onChange: (selected: string) => void,
}

function NumberInput({ className, value, onChange }: NumberInputProps) {
  // TODO: would be nice to force integer input, but it's hard to do that properly
  // unfortunately firefox allows non-numeric input and treats such input as empty
  // there does not seem to be an easy cross-platform fix
  return (
    <td className={`number-input-component ${className}`}>
      <input
        type="number"
        maxLength={2}
        inputMode="numeric"
        min="0"
        step="1"
        placeholder="0"
        value={value}
        onInput={(event) => onChange(event.currentTarget.value)}
      />
    </td>
  );
}

export default NumberInput;
