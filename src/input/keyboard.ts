export function initKeyboard() {
  window.addEventListener("keydown", (e) => {
    if (e.repeat) return;

    const t = performance.now();
    console.log("Key:", e.key, "Time:", t);
  });
}