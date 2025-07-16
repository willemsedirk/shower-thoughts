import { useState } from "react";

const THOUGHTS = [
  "If you clean a vacuum cleaner, aren’t you the vacuum cleaner?",
  "Why do we drive on parkways and park on driveways?",
  "If a word is misspelled in the dictionary, how would we ever know?",
  "Do fish in water know they’re wet?",
  "If you try to fail and succeed, which have you done?",
  // ...add more surreal, nonsensical thoughts
];

export function useShowerThoughts(): [string, () => void] {
  const [thought, setThought] = useState(
    THOUGHTS[Math.floor(Math.random() * THOUGHTS.length)]
  );
  const generateThought = () => {
    let newThought;
    do {
      newThought = THOUGHTS[Math.floor(Math.random() * THOUGHTS.length)];
    } while (newThought === thought);
    setThought(newThought);
  };
  return [thought, generateThought];
} 