interface NumberInputProps {
  className: string,
  value: string,
  onChange: (selected: string) => void,
}

function NumberInput({ className, value, onChange }: NumberInputProps) {
  return (
    <td className={`number-input-component ${className}`}>
      <input
        type="number"
        min="0"
        max="99"
        step="1"
        placeholder="0"
        value={value}
        onChange={(event) => onChange(event.currentTarget.value)}
      />
    </td>
  );
}

export default NumberInput;
