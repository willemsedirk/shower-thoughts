import React, { useState } from "react";
import Hero3D from "./components/Hero3D";
import ModeSwitcher from "./components/ModeSwitcher";
import AudioManager from "./components/AudioManager";
import WaterRippleBackground from "./components/WaterRippleBackground";

export type VisualMode = "dark" | "zen" | "chaos";

const App: React.FC = () => {
  const [mode, setMode] = useState<VisualMode>("dark");

  return (
    <div className={`relative min-h-screen w-full overflow-hidden ${mode}`}>
      <Hero3D />
      <WaterRippleBackground mode={mode} />
      <div className="absolute top-6 right-6 z-20 pointer-events-auto">
        <ModeSwitcher mode={mode} setMode={setMode} />
      </div>
      <AudioManager mode={mode} />
    </div>
  );
};

export default App; 