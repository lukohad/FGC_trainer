/**
 * A fighting-game-style input after translating from a physical keyboard key.
 */

//imports
 import { onKeyDown, onKeyUp , getResolvedDirection} from "./inputState";

//Tekken inputs: GameInput = "LEFT" | "RIGHT" | "DOWN" | "UP" | "LP" | "RP" | "LK" | "RK";
export type GameInput = string;

/**
 * Information about one recorded input.
 * The timestamp will matter later for timing windows, combos, EWGF, wavedash, etc.
 */
export type InputEventRecord = {
  input: GameInput;
  key: string;
  timestamp: number;
  active: boolean;
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
 * Keys shouldnt cause page to scroll or do browser junk
 * while inputs are being used.
 */
const preventDefaultKeys = new Set(
  [
  "Space",
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "KeyW",
  "KeyA",
  "KeyS",
  "KeyD"
  ]
);

/**
 * Converts a the keyboard key into the app's fighting game input.
 * Later, will be added with aliases, rebinding, controller input, etc.
 */
function translateKey(key: string): GameInput | null {
  // Get key inside keyMap.
  // If it exists, return the mapped input.
  // If not, return null (prevent errors).
  return keyMap[key] ?? null;
}

 // Creates a record for one valid input.
function createInputRecord(key: string, input: GameInput): InputEventRecord {
  return {
    key,
    input,
    timestamp: performance.now(),
    active: false //will be used for ui display, to show which buttons are being currently held down. Will be set to true on keydown, false on keyup.
  };
}

/**
 * Sets up keyboard input listening. When a valid input is detected, calls onInput with a record of that input.
 *
 * main.ts will call this function and provide the onInput callback.
 */
export function setupKeyHandlers(
  onInput: InputCallback,
  onRelease: (input: GameInput) => void
): void 
{
  document.addEventListener("keydown", (event) => 
  {
    if (event.repeat) return;
    // Translate the physical key into a game input (if possible).
    const input = translateKey(event.code);

    // If this key isn't mapped to an input, ignore it.
    if (!input) {
      return;
    }

    // Prevent default browser behavior for certain keys (like space scrolling the page).
    if (preventDefaultKeys.has(event.code)) {
      event.preventDefault();
    }

    // Create a record of this input for the callback.
    const record = createInputRecord(event.code, input);
    record.active = true;

    // Also update input state for SOCD resolution
    onKeyDown(event.code); 

    const isDirectional = ["KeyA", "KeyS", "KeyD", "Space"].includes(event.code);
    const resolved = isDirectional ? getResolvedDirection() : input;
    
    // Report the input through the callback so the rest of the app can react to it.
    onInput({...record, input: resolved});
  });

  document.addEventListener("keyup", (event) => {
    // check if the key released is mapped to an input
    if (preventDefaultKeys.has(event.code)) {
      event.preventDefault();
    }
    // Translate the physical key into a game input (if possible).
    onKeyUp(event.code);

    const isDirectional = ["KeyA", "KeyS", "KeyD", "Space"].includes(event.code);
    const resolvedInput = isDirectional ? getResolvedDirection() : translateKey(event.code);

    if (resolvedInput) {
      onRelease(resolvedInput);
    }
  });
}
