import { useEffect } from "react";
import { Howl } from "howler";
// @ts-ignore
import water from "../assets/sounds/water.mp3";
// @ts-ignore
import lofi from "../assets/sounds/lofi.mp3";
import { VisualMode } from "../App";

const ambient = new Howl({ src: [water], loop: true, volume: 0.3 });
const music = new Howl({ src: [lofi], loop: true, volume: 0.2 });

const AudioManager: React.FC<{ mode: VisualMode }> = ({ mode }) => {
  useEffect(() => {
    ambient.play();
    music.play();
    return () => {
      ambient.stop();
      music.stop();
    };
  }, []);

  useEffect(() => {
    // Adjust volumes or effects per mode
    if (mode === "chaos") {
      music.volume(0.4);
      ambient.rate(1.2);
    } else if (mode === "zen") {
      music.volume(0.15);
      ambient.rate(0.8);
    } else {
      music.volume(0.2);
      ambient.rate(1.0);
    }
  }, [mode]);

  return null;
};

export default AudioManager; 