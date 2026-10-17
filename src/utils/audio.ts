/**
 * Web Audio API synthesizer for realistic emergency sirens, joyful chimes, and romantic alerts.
 * Works seamlessly in all modern browsers without needing external sound files.
 */

let audioCtx: AudioContext | null = null;
let sirenOscillator1: OscillatorNode | null = null;
let sirenOscillator2: OscillatorNode | null = null;
let sirenLFO: OscillatorNode | null = null;
let sirenGain: GainNode | null = null;
let sirenInterval: ReturnType<typeof setInterval> | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Play loud emergency warble siren (simulates emergency horn / siren)
 */
export function playEmergencySiren(): void {
  try {
    const ctx = getAudioContext();
    stopEmergencySiren(); // ensure no duplicates

    const now = ctx.currentTime;
    sirenGain = ctx.createGain();
    sirenGain.gain.setValueAtTime(0.4, now);
    sirenGain.connect(ctx.destination);

    sirenOscillator1 = ctx.createOscillator();
    sirenOscillator1.type = 'sawtooth';

    sirenOscillator2 = ctx.createOscillator();
    sirenOscillator2.type = 'sine';

    // LFO to modulate siren pitch up and down rapidly
    sirenLFO = ctx.createOscillator();
    sirenLFO.frequency.setValueAtTime(3.5, now); // 3.5 cycles per second
    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(250, now); // pitch depth

    sirenLFO.connect(lfoGain);
    sirenOscillator1.frequency.setValueAtTime(750, now);
    sirenOscillator2.frequency.setValueAtTime(900, now);

    lfoGain.connect(sirenOscillator1.frequency);
    lfoGain.connect(sirenOscillator2.frequency);

    sirenOscillator1.connect(sirenGain);
    sirenOscillator2.connect(sirenGain);

    sirenLFO.start(now);
    sirenOscillator1.start(now);
    sirenOscillator2.start(now);
  } catch (e) {
    console.warn('Audio playback not permitted or failed:', e);
  }
}

/**
 * Stop emergency siren
 */
export function stopEmergencySiren(): void {
  try {
    if (sirenOscillator1) {
      sirenOscillator1.stop();
      sirenOscillator1.disconnect();
      sirenOscillator1 = null;
    }
    if (sirenOscillator2) {
      sirenOscillator2.stop();
      sirenOscillator2.disconnect();
      sirenOscillator2 = null;
    }
    if (sirenLFO) {
      sirenLFO.stop();
      sirenLFO.disconnect();
      sirenLFO = null;
    }
    if (sirenGain) {
      sirenGain.disconnect();
      sirenGain = null;
    }
    if (sirenInterval) {
      clearInterval(sirenInterval);
      sirenInterval = null;
    }
  } catch (e) {
    console.warn('Error stopping siren:', e);
  }
}

/**
 * Play a joyful celebratory chime when "حاجة حلوة حصلت!" is pressed
 */
export function playGoodNewsChime(): void {
  try {
    const ctx = getAudioContext();
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
    const now = ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.12);

      gain.gain.setValueAtTime(0, now + idx * 0.12);
      gain.gain.linearRampToValueAtTime(0.3, now + idx * 0.12 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.12);
      osc.stop(now + idx * 0.12 + 0.7);
    });
  } catch (e) {
    console.warn('Good news chime failed:', e);
  }
}

/**
 * Play gentle love ping / reminder tone
 */
export function playLovePingSound(): void {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const chords = [587.33, 880, 1174.66]; // D5, A5, D6 harp chime

    chords.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0.2, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 1.3);
    });
  } catch (e) {
    console.warn('Love ping sound failed:', e);
  }
}

/**
 * Play message send/receive pop
 */
export function playMessageSound(): void {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(900, now + 0.1);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.15);
  } catch (e) {
    console.warn('Message sound failed:', e);
  }
}

/**
 * Play mystery box unlock sparkle sound
 */
export function playBoxOpenSound(): void {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const scale = [440, 554.37, 659.25, 830.61, 880, 1108.73, 1318.51, 1661.22];

    scale.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.07);

      gain.gain.setValueAtTime(0.2, now + idx * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.07);
      osc.stop(now + idx * 0.07 + 0.55);
    });
  } catch (e) {
    console.warn('Box open sound failed:', e);
  }
}
