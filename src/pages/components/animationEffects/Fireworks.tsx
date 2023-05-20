import Particles from "react-tsparticles";
import { loadFireworksPreset } from "tsparticles-preset-fireworks";

export const Fireworks = () => {
  const customInit = async (engine) => {
    // this adds the preset to tsParticles, you can safely use the
    await loadFireworksPreset(engine);
  };
  return (
    <Particles
      id="tsparticles"
      init={customInit}
      options={{ preset: "fireworks" }}
    />
  );
};
