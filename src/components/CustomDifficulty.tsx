import DifficultySlider from './DifficultySlider';

interface CustomDifficultyProps {
  customDifficulty: number[],
  setCustomDifficulty: (updater: ((prev: number[]) => number[])) => void,
}

function CustomDifficulty({ customDifficulty, setCustomDifficulty }: CustomDifficultyProps) {
  const setProportion = (index: number) => (selected: number) => {
    setCustomDifficulty((prev) => {
      const newSelection = [...prev];
      newSelection[index] = selected;
      return newSelection;
    });
  };

  // convert to proportions for display
  let easy = customDifficulty[0];
  let normal = customDifficulty[1];
  let hard = customDifficulty[2];
  const total = easy + normal + hard;
  if (total <= 0) {
    easy = 1 / 3;
    normal = easy;
    hard = easy;
  } else {
    easy /= total;
    normal /= total;
    hard /= total;
  }

  return (
    <div className="custom-difficulty-component">
      <fieldset>
        <legend>Difficulty distribution</legend>
        <DifficultySlider name="Easy" proportion={customDifficulty[0]} onChange={setProportion(0)} adjustedProportion={easy} />
        <DifficultySlider name="Normal" proportion={customDifficulty[1]} onChange={setProportion(1)} adjustedProportion={normal} />
        <DifficultySlider name="Hard" proportion={customDifficulty[2]} onChange={setProportion(2)} adjustedProportion={hard} />
      </fieldset>
    </div>
  );
}

export default CustomDifficulty;
