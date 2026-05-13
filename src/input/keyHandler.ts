// src/keyHandler.ts

/**
 * A fighting-game-style input after translating from a physical keyboard key.
 *
 * Examples:
 * "→", "←", "↓", "↑", "LP", "MP", "HP", "K"
 */
export type GameInput = string;

/**
 * Information about one recorded input.
 * The timestamp will matter later for timing windows, combos, EWGF, wavedash, etc.
 */
export type InputEventRecord = {
  input: GameInput;
  key: string;
  timestamp: number;
};

/**
 * Function type for whatever should happen when a valid input is detected.
 *
 * main.ts will provide this function.
 */
export type InputCallback = (record: InputEventRecord) => void;

/**
 * Map physical keyboard keys to fighting-game inputs.
 *
 * Start small. You can change these later.
 */
const keyMap: Record<string, GameInput> = {
  // Movement — leverless style
  KeyA: "LEFT",
  KeyS: "DOWN",
  KeyD: "RIGHT",
  Space: "UP",

  // Tekken buttons
  KeyU: "LP", // Tekken 1
  KeyI: "RP", // Tekken 2
  KeyJ: "LK", // Tekken 3
  KeyK: "RK", // Tekken 4
};

/**
 * Keys that should not cause the page to scroll or do browser behavior
 * while practicing.
 */
const preventDefaultKeys = new Set([
  "Space",
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
]);

/**
 * Converts a raw keyboard key into your app's fighting game input.
 *
 * This is intentionally small.
 * Later, this could handle aliases, rebinding, controller input, etc.
 */
function translateKey(key: string): GameInput | null {
  // Get key inside keyMap.
  // If it exists, return the mapped input.
  // If not, return null (prevent errors).
  return keyMap[key] ?? null;
}

/**
 * Creates a record for one valid input.
 */
function createInputRecord(key: string, input: GameInput): InputEventRecord {
  return {
    key,
    input,
    timestamp: performance.now(),
  };
}

/**
 * Sets up keyboard input listening.
 *
 * This file should NOT directly update the page.
 * Instead, it reports valid inputs through the onInput callback.
 */
export function setupKeyHandler(onInput: InputCallback): void {
  document.addEventListener("keydown", (event) => {
    const input = translateKey(event.code);

    if (!input) {
      return;
    }

    if (preventDefaultKeys.has(event.code)) {
      event.preventDefault();
    }

    const record = createInputRecord(event.code, input);

    onInput(record);
  });
}