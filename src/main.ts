import './style.css';
import {setupKeyHandlers} from './input/keyHandler';

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
};

const directionalInputs = ["LEFT", "RIGHT", "UP", "DOWN", "UP_LEFT", "UP_RIGHT", "DOWN_LEFT", "DOWN_RIGHT", "NEUTRAL"];

function updateDirectionalDisplay(resolvedDirection: string): void {
  // Step 1: clear all directional tokens
  directionalInputs.forEach(input => {
    document.querySelector(`[data-input="${input}"]`)?.classList.remove('active');
  });
  // Step 2: highlight the resolved one
  document.querySelector(`[data-input="${resolvedDirection}"]`)?.classList.add('active');
}

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
          <!-- hardcoded rows for now -->
          <div class="feed-entry">→ 1f</div>
          <div class="feed-entry">↓ 2f</div>
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
  (record) => {
    if (directionalInputs.includes(record.input)) {
    updateDirectionalDisplay(record.input);
    } else {
    const token = document.querySelector(`[data-input="${record.input}"]`);
    if (token) token.classList.add('active');
    }
  },
  (input) => {
    if (directionalInputs.includes(input)) {
      updateDirectionalDisplay(input);
    } else {
      const token = document.querySelector(`[data-input="${input}"]`);
      if (token) token.classList.remove('active');
    }
  }
);