import ProportionSlider from './ProportionSlider';

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
        <ProportionSlider proportion={customDifficulty[0]} onChange={setProportion(0)}>
          {` ${Math.floor(easy * 100)}% Easy`}
        </ProportionSlider>
        <ProportionSlider proportion={customDifficulty[1]} onChange={setProportion(1)}>
          {` ${Math.floor(normal * 100)}% Normal`}
        </ProportionSlider>
        <ProportionSlider proportion={customDifficulty[2]} onChange={setProportion(2)}>
          {` ${Math.floor(hard * 100)}% Hard`}
        </ProportionSlider>
      </fieldset>
    </div>
  );
}

export default CustomDifficulty;
