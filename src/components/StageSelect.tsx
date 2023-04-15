interface StageSelectProps {
  name: string,
  green: number,
  yellow: number,
  blue: number,
  onChangeGreen: (count: number) => void,
  onChangeYellow: (count: number) => void,
  onChangeBlue: (count: number) => void,
}

function StageSelect({
  name,
  green,
  yellow,
  blue,
  onChangeGreen,
  onChangeYellow,
  onChangeBlue,
}: StageSelectProps) {
  const colors = [
    { className: 'green', value: green, change: onChangeGreen },
    { className: 'yellow', value: yellow, change: onChangeYellow },
    { className: 'blue', value: blue, change: onChangeBlue },
  ];

  return (
    <tr className="stage-select-component">
      <th>
        Stage&nbsp;
        {name}
        :
      </th>
      {colors.map((color) => (
        <td
          className={color.className}
          key={`${name}-${color.className}`}
        >
          <input
            type="number"
            min="0"
            max="99"
            step="1"
            placeholder="0"
            value={color.value}
            onChange={(event) => color.change(event.currentTarget.valueAsNumber)}
          />
        </td>
      ))}
    </tr>
  );
}

export default StageSelect;
