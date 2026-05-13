import './style.css';
import { setupKeyHandler } from './input/keyHandler';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <main class="app">
    <script type="module" src="./input/keyboard.ts"></script>
    
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
            Practice EWGF inputs with consistent timing.
          </p>
        </section>

        <section class="input-card user-card">
          <h3>Your Input</h3>

          <div class="inputs user-input">
            <div class="input-token">
              <span class="input-key">→</span>
              <small class="frame-count">1f</small>
            </div>

            <div class="input-token">
              <span class="input-key">☆</span>
              <small class="frame-count">2f</small>
            </div>

            <div class="input-token">
              <span class="input-key">↓</span>
              <small class="frame-count">3f</small>
            </div>

            <div class="input-token">
              <span class="input-key bad">↓</span>
              <small class="frame-count bad-text">4f</small>
            </div>

            <div class="input-token">
              <span class="input-key">2</span>
              <small class="frame-count">5f</small>
            </div>
          </div>
        </section>
      </div>

      <aside class="stats-card">
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
      </aside>
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

setupKeyHandler((record) => {
  console.log('Input detected:', record);
});