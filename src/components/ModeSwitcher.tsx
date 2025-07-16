import React from "react";
import { VisualMode } from "../App";
import { Sun, Moon, Zap } from "lucide-react";
import { Howl } from "howler";
// @ts-ignore
import modeSwitch from "../assets/sounds/mode-switch.mp3";

const switchSound = new Howl({ src: [modeSwitch], volume: 0.4 });

const icons = {
  dark: <Moon />,
  zen: <Sun />,
  chaos: <Zap />,
};

const nextMode = (mode: VisualMode): VisualMode =>
  mode === "dark" ? "zen" : mode === "zen" ? "chaos" : "dark";

const ModeSwitcher: React.FC<{ mode: VisualMode; setMode: (m: VisualMode) => void }> = ({
  mode,
  setMode,
}) => (
  <button
    onClick={() => {
      setMode(nextMode(mode));
      switchSound.play();
    }}
    className="p-2 rounded-full bg-white/20 hover:bg-white/40 shadow"
    aria-label="Switch visual mode"
  >
    {icons[mode]}
  </button>
);

export default ModeSwitcher; 