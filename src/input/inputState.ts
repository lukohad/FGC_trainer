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

    // SOCD resolution logic:
    if (left && right) return "NEUTRAL";
    if (down && up)    return "NEUTRAL";

    if (left && up)   return "UP_LEFT";
    if (right && up)  return "UP_RIGHT";
    if (left && down) return "DOWN_LEFT";
    if (right && down) return "DOWN_RIGHT";

    //regular directional logic:
    if (left)  return "LEFT";
    if (right) return "RIGHT";
    if (down)  return "DOWN";
    if (up)    return "UP";

    return "NEUTRAL";
}

export function getResolvedDirection(): string {
    return socdHandler();
}   