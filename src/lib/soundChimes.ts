/**
 * Browser-native Web Audio API synthesizer generating subtle audio chimes.
 * 0kB audio assets, zero external server requests.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

function isSoundEnabled(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("growzok-sound-effects") !== "disabled";
}

/**
 * Plays a pleasant 2-tone success chime (F4 -> C5) upon habit completion.
 */
export function playCompletionChime() {
  if (!isSoundEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sine";

  // F4 (349.23 Hz) -> C5 (523.25 Hz)
  osc.frequency.setValueAtTime(349.23, now);
  osc.frequency.exponentialRampToValueAtTime(523.25, now + 0.08);

  gain.gain.setValueAtTime(0.12, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.35);
}

/**
 * Plays a 3-tone victory arpeggio (C5 -> E5 -> G5) when a Pomodoro focus session finishes.
 */
export function playFocusFinishChime() {
  if (!isSoundEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const notes = [523.25, 659.25, 783.99]; // C5, E5, G5

  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    const noteTime = now + idx * 0.12;
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, noteTime);

    gain.gain.setValueAtTime(0.15, noteTime);
    gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.4);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(noteTime);
    osc.stop(noteTime + 0.4);
  });
}
