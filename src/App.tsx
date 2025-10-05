import { Animation } from "./animation";

export const App = () => {
  return (
    <Animation
      // supports 2-4 words
      words={["Bra", "folk", "smarte", "løsninger"]}
      duration={0.5} // per item
      pauseDuration={0.25} // pause between each item appears
      inactiveBoxColor="#fff"
      activeBoxColor="#ffd24c"
      backgroundColor="#97d2ec"
      lineColor="#fff"
      linePadding={3}
    />
  );
};
