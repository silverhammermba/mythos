import StageSelect from './StageSelect';

interface DeckCountSelectProps {
  deckCount: string[],
  onChange: (updater: ((prev: string[]) => string[])) => void,
}

function DeckCountSelect({ deckCount, onChange }: DeckCountSelectProps) {
  const setDeckCount = (index: number) => (count: string) => {
    onChange((prev) => {
      const newCounts = [...prev];
      newCounts[index] = count;
      return newCounts;
    });
  };

  const stages = [
    { name: 'I', offset: 0 },
    { name: 'II', offset: 3 },
    { name: 'III', offset: 6 },
  ];

  return (
    <table className="deck-count-select-component">
      <caption>Custom Deck</caption>
      <tbody>
        {stages.map((stage) => (
          <StageSelect
            key={stage.name}
            name={stage.name}
            green={deckCount[stage.offset]}
            yellow={deckCount[stage.offset + 1]}
            blue={deckCount[stage.offset + 2]}
            onChangeGreen={setDeckCount(stage.offset)}
            onChangeYellow={setDeckCount(stage.offset + 1)}
            onChangeBlue={setDeckCount(stage.offset + 2)}
          />
        ))}
      </tbody>
    </table>
  );
}

export default DeckCountSelect;
