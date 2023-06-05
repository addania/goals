import Particles from "react-tsparticles";
import type { Engine } from "tsparticles-engine";
import { loadConfettiPreset } from "tsparticles-preset-confetti";

export const Confetti = () => {
  const customInit = async (engine: Engine) => {
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
