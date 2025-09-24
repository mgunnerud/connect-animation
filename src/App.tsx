import { Animation } from "./animation";

export const App = () => {
  return (
    <Animation
      words={["Bra", "folk", "smarte", "løsninger"]}
      duration={2.2}
      inactiveBoxColor="#fff"
      activeBoxColor="#ffd24c"
      backgroundColor="#97d2ec"
      lineColor="#fff"
      linePadding={3}
    />
  );
};
