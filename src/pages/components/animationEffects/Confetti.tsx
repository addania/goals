import Particles from "react-tsparticles";
import { loadConfettiPreset } from "tsparticles-preset-confetti";

export const Confetti = () => {
  const customInit = async (engine) => {
    // this adds the preset to tsParticles, you can safely use the
    await loadConfettiPreset(engine);
  };
  return (
    <Particles
      id="tsparticles"
      init={customInit}
      options={{ preset: "confetti" }}
    />
  );
};
