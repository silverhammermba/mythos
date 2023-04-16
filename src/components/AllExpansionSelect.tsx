import { packs } from '../content';
import ExpansionSelect from './ExpansionSelect';

interface AllExpansionSelectProps {
  enabledPacks: boolean[],
  setEnabledPacks: (updater: ((prev: boolean[]) => boolean[])) => void,
}

function AllExpansionSelect({
  enabledPacks,
  setEnabledPacks,
}: AllExpansionSelectProps) {
  const setEnabled = (index: number) => (selected: boolean) => {
    setEnabledPacks((prev) => {
      const newSelection = [...prev];
      newSelection[index] = selected;
      return newSelection;
    });
  };

  return (
    <fieldset className="all-expansion-select-component">
      <legend>Expansions</legend>
      {
        // don't show base pack since we never want to deselect it
        packs.map((pack, index) => index !== 0 && (
          <ExpansionSelect
            key={pack.name}
            name={pack.name}
            selected={enabledPacks[index]}
            onChange={setEnabled(index)}
          />
        ))
      }
    </fieldset>
  );
}

export default AllExpansionSelect;
