// This file is responsible for tracking the current state of inputs (which keys are currently held)
// socd resolutions and diagonal inputs get decided here
// This file should NOT directly update the page. Instead, it reports valid inputs through the onInput callback.

// What keys are currently physically held
const heldKeys = new Set<string>();

// Called by keyHandler when a key goes down
export function onKeyDown(code: string): void {
    heldKeys.add(code);
    const socdDirection = socdHandler();
    // For debugging purposes, log the current SOCD-resolved direction whenever a key event happens.
    console.log('Current SOCD-resolved direction (KeyDown):', socdDirection);
}

// Called by keyHandler when a key is released
export function onKeyUp(code: string): void {
    heldKeys.delete(code);
    const socdDirection = socdHandler();
    console.log('Current SOCD-resolved direction (KeyUp):', socdDirection);
}

// Looks at heldKeys and returns the resolved directional
function socdHandler(): string {
  const left  = heldKeys.has("KeyA");
  const right = heldKeys.has("KeyD");
  const down  = heldKeys.has("KeyS");
  const up    = heldKeys.has("Space");

  // cancel opposites first
  const resolvedH = left && right ? false : left ? "LEFT" : right ? "RIGHT" : false;
  const resolvedV = down && up    ? false : down ? "DOWN" : up   ? "UP"    : false;

  // now combine what survived
  if (resolvedH && resolvedV) return `${resolvedV}_${resolvedH}`;
  if (resolvedH) return resolvedH;
  if (resolvedV) return resolvedV;
  return "NEUTRAL";
}

export function getResolvedDirection(): string {
    return socdHandler();
}   