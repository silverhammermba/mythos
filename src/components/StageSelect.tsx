import NumberInput from './NumberInput';

interface StageSelectProps {
  name: string,
  green: string,
  yellow: string,
  blue: string,
  onChangeGreen: (count: string) => void,
  onChangeYellow: (count: string) => void,
  onChangeBlue: (count: string) => void,
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
  return (
    <tr className="stage-select-component">
      <th>
        Stage&nbsp;
        {name}
        :
      </th>
      <NumberInput className="green" value={green} onChange={onChangeGreen} />
      <NumberInput className="yellow" value={yellow} onChange={onChangeYellow} />
      <NumberInput className="blue" value={blue} onChange={onChangeBlue} />
    </tr>
  );
}

export default StageSelect;
