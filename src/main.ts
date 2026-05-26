//imports
import './style.css';
import {setupKeyHandlers} from './input/keyHandler';
import * as drill from './drills'; //mainly for dot syntax for drill types
import { nextInput, isDrillComplete, getNextExpectedInput } from './drills'; //functions for the drill handling logic

//vars for tracking input feed and timing
const maxFeedCount = 10 // Max number of entries to show in the feed at once
let inputStartTime: number = performance.now();
let activeFeedEntry: Element | null = null;
let activeSymbol: string = "☆"; // start at neutral
let activeToken: Element | null = null; // the currently active input token in the UI, to be updated with frame counts and such
let drillProgress: number = 0; // how far the user is in the current drill sequence

//display map for showing inputs as symbols in the feed and input display
const displayMap: Record<string, string> = {
  LEFT:       "←",
  RIGHT:      "→",
  DOWN:       "↓",
  UP:         "↑",
  UP_LEFT:    "↖",
  UP_RIGHT:   "↗",
  DOWN_LEFT:  "↙",
  DOWN_RIGHT: "↘",
  LP:         "1",
  RP:         "2",
  LK:         "3",
  RK:         "4",

  NEUTRAL: "☆"
};

const directionalInputs = ["LEFT", "RIGHT", "UP", "DOWN", "UP_LEFT", "UP_RIGHT", "DOWN_LEFT", "DOWN_RIGHT", "NEUTRAL"];

function updateDirectionalDisplay(resolvedDirection: string): void 
{
  // Step 1: clear all directional tokens
  directionalInputs.forEach(input => {
    document.querySelector(`[data-input="${input}"]`)?.classList.remove('active');
  });
  // Step 2: highlight the resolved one
  document.querySelector(`[data-input="${resolvedDirection}"]`)?.classList.add('active');
}

function startNewFeedEntry(input: string): void
{
  const feed = document.querySelector('.feed-card');
  if (!feed) return;

  // trim old entries
  while (feed.children.length >= maxFeedCount)
  {
    const last = feed.lastChild;
    if (last) feed.removeChild(last);
  }

  // create new entry
  const entry = document.createElement('div');
  const result = getInputResult(input);

  if (result === 'pass') {
    entry.classList.add('feed-entry', 'pass');
  } else if (result === 'fail') {
    entry.classList.add('feed-entry', 'fail');
  } else {
    entry.classList.add('feed-entry');
  }

  // set text immediately so it's never blank
  entry.textContent = `${displayMap[input] ?? input} 0f`;

  feed.prepend(entry);

  // track it
  activeFeedEntry = entry;
  activeSymbol = displayMap[input] ?? input;
  inputStartTime = performance.now();
  activeToken = document.querySelector(`[data-input="${input}"]`);
}

// tick runs every frame and updates the live counter
function tick(): void
{
  if (activeFeedEntry)
  {
    const elapsed = performance.now() - inputStartTime;
    const frames = Math.min(Math.round(elapsed / (1000 / 60)), 99);
    activeFeedEntry.textContent = `${activeSymbol} ${frames}f`;
    
    if (activeToken) {
      const frameEl = activeToken.querySelector('.frame-count');
      if (frameEl) frameEl.textContent = `${frames}f`;
    }
  }
  requestAnimationFrame(tick);
}

//helper to flash the input feed entry green for success or red for failure
function flashCommand(className: 'pass' | 'fail'): void {
  const commandEl = document.querySelector('.command');
  if (!commandEl) return;
  commandEl.classList.add(className);
  setTimeout(() => commandEl.classList.remove(className), 250);
}
//drill check in keyhandler input callback
function checkDrillInput(input: string): void {
  if (input === "NEUTRAL") return; // neutral is never checked against the drill
  
  const expectedInput = getNextExpectedInput(drill.EWGF, drillProgress);
  if (input === expectedInput) {
    drillProgress = nextInput(drill.EWGF, drillProgress, input);
    if (isDrillComplete(drill.EWGF, drillProgress)) {
      drillProgress = 0;
      flashCommand('pass');
    }
  } else {
    drillProgress = 0;
    flashCommand('fail');
  }
}
// just checks — no side effects, returns result
function getInputResult(input: string): 'pass' | 'fail' | 'neutral' {
  if (input === "NEUTRAL") return 'neutral';
  const expectedInput = getNextExpectedInput(drill.EWGF, drillProgress);
  return input === expectedInput ? 'pass' : 'fail';
}

// start with neutral and kick off the loop
startNewFeedEntry("NEUTRAL");
requestAnimationFrame(tick);



document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <main class="app">
    <header class="topbar">
      <div>
        <h1>FGC Practice Tool</h1>
        <p>Execution training for fighting games</p>
      </div>

      <div class="controls">
        <select>
          <option class="hidden_option" selected disabled>Game Select</option>
          <option>Tekken 8</option>
          <option>Street Fighter 6</option>
          <option>Guilty Gear Strive</option>
        </select>

        <select>
          <option class="hidden_option" selected disabled>Execution</option>
          <option>EWGF</option>
          <option>Wavedash</option>
          <option>JFSR</option>
          <option>Slide Cancel</option>
        </select>

        <button type="button">
        Freemode
        </button>
      </div>
    </header>

    <section class="layout">
      <div class="practice-column">
        <section class="practice-card">
          <p class="eyebrow">Current Drill</p>

          <!-- Replace with a button or dropdown later to select other drills -->

          <h2>EWGF Practice</h2>
          <p class="command">→ ☆ ↓ ↘ + 2</p>
          <p class="description">
            Practice EWGF inputs!
          </p>
        </section>

        <section class="input-card user-card">
          <h3>Your Input</h3>

          <div class="inputs user-input">
            <div class="input-token" data-input="LEFT">
              <span class="input-key">←</span>
              <small class="frame-count">0f</small>
            </div>

            <div class="input-token" data-input="UP">
              <span class="input-key">↑</span>
              <small class="frame-count">0f</small>
            </div>

            <div class="input-token" data-input="DOWN">
              <span class="input-key">↓</span>
              <small class="frame-count">0f</small>
            </div>

            <div class="input-token" data-input="RIGHT">
              <span class="input-key">→</span>
              <small class="frame-count">0f</small>
            </div>

            <div class="input-token" data-input="UP_LEFT">
              <span class="input-key">↖</span>
              <small class="frame-count">0f</small>
            </div>

            <div class="input-token" data-input="UP_RIGHT">
              <span class="input-key">↗</span>
              <small class="frame-count">0f</small>
            </div>

            <div class="input-token" data-input="DOWN_LEFT">
              <span class="input-key">↙</span>
              <small class="frame-count">0f</small>
            </div>

            <div class="input-token" data-input="DOWN_RIGHT">
              <span class="input-key">↘</span>
              <small class="frame-count">0f</small>
            </div>

            <div class="input-token" data-input="NEUTRAL">
              <span class="input-key">☆</span>
              <small class="frame-count">0f</small>
            </div>

            <div class="input-token" data-input="LP">
              <span class="input-key">1</span>
              <small class="frame-count">0f</small>
            </div>

            <div class="input-token" data-input="RP">
              <span class="input-key">2</span>
              <small class="frame-count">0f</small>
            </div>

            <div class="input-token" data-input="LK">
              <span class="input-key">3</span>
              <small class="frame-count">0f</small>
            </div>
            
            <div class="input-token" data-input="RK">
              <span class="input-key">4</span>
              <small class="frame-count">0f</small>
            </div>
          </div>
        </section>
      </div>

      <div class="right-column">
        <aside class="feed-card">
        </aside>

        <aside class="stats-card">
          <div class= "stats-column">
            <h2>Session Stats</h2>

            <div class="stat">
              <span>Accuracy</span>
              <strong>72%</strong>
            </div>

            <div class="stat">
              <span>Streak</span>
              <strong>5</strong>
            </div>

            <div class="stat">
              <span>Attempts</span>
              <strong>38</strong>
            </div>

            <div class="stat">
              <span>Average Timing</span>
              <strong>14f</strong>
            </div>
          </div>
        </aside>
      </div>
    </section>

    <section class="history-card">
      <h2>Recent Attempts</h2>

      <ul>
        <li><span class="success">✓</span> Success — 14f</li>
        <li><span class="fail">✗</span> Missed diagonal</li>
        <li><span class="success">✓</span> Success — 13f</li>
        <li><span class="fail">✗</span> Late punch input</li>
      </ul>
    </section>

  </main>
`;

setupKeyHandlers(
  //input callback
  (record) => {
  startNewFeedEntry(record.input);

  // drill check happens for ALL inputs, not just directionals
  checkDrillInput(record.input);

  // display update happens separately
  if (directionalInputs.includes(record.input)) {
    updateDirectionalDisplay(record.input);
  } else {
    const token = document.querySelector(`[data-input="${record.input}"]`);
    if (token) token.classList.add('active');
  }
},
  //key release callback
  (input) => {
  if (directionalInputs.includes(input)) {
    updateDirectionalDisplay(input);
    startNewFeedEntry(input);

    // check neutral against drill sequence
    if (input === "NEUTRAL") {
      checkDrillInput(input);
    }
  } else {
    const token = document.querySelector(`[data-input="${input}"]`);
    if (token) token.classList.remove('active');
  }
});