interface NumberInputProps {
  className: string,
  value: string,
  onChange: (selected: string) => void,
}

function NumberInput({ className, value, onChange }: NumberInputProps) {
  // N.B. firefox allows non-integer input and just reports it as empty
  // so react can't validate this. but firefox will validate it when the form is submitted
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
