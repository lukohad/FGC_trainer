import type { GameInput } from "./input/keyHandler";

export type Drill = {
  name: string;
  sequence: GameInput[];
  jf: number; //when the first input is in the sequence where the just frame window starts. 
              // ewgf is 3 since down right + 2 need to be on the same frame
};

export const EWGF: Drill = {
  name: "EWGF",
  sequence: ["RIGHT", "DOWN", "DOWN_RIGHT", "RP"],
  jf: 2
};

//functions
//know which input is expected next
export function getNextExpectedInput(drill: Drill, currentProgress: number): GameInput | null {
    if (currentProgress < drill.sequence.length) {
        return drill.sequence[currentProgress];
    } else {
        return null; // sequence complete, no more expected input
    }
}

//go to next step on correct input
export function nextInput(drill: Drill, currentProgress: number, input: GameInput): number {
  const expectedInput = getNextExpectedInput(drill, currentProgress);
  if (input === expectedInput) {
    return currentProgress + 1; // move to next step
  } else {
    return 0; // reset on wrong input
  }
}

//know when sequence is complete
export function isDrillComplete(drill: Drill, currentProgress: number): boolean {
  return currentProgress >= drill.sequence.length;
}