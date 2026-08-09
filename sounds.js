/**
 * Neighborly Sound Design
 */
const Sounds = (() => {
  let ctx = null;
  let enabled = true;

  function getCtx() {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    return ctx;
  }

  function playTone({ freq = 440, duration = 0.08, type = 'sine', volume = 0.12, attack = 0.01, detune = 0 }) {
    if (!enabled) return;
    try {
      const ac = getCtx();
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      osc.detune.value = detune + (Math.random() * 20 - 10);
      gain.gain.setValueAtTime(0, ac.currentTime);
      gain.gain.linearRampToValueAtTime(volume, ac.currentTime + attack);
      gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + duration);
      osc.connect(gain);
      gain.connect(ac.destination);
      osc.start(ac.currentTime);
      osc.stop(ac.currentTime + duration + 0.02);
    } catch (e) {}
  }

  function click() {
    playTone({ freq: 180 + Math.random() * 40, duration: 0.045, type: 'sine', volume: 0.08, attack: 0.005 });
  }

  function success() {
    if (!enabled) return;
    try {
      playTone({ freq: 523.25, duration: 0.12, type: 'sine', volume: 0.1, attack: 0.01 });
      setTimeout(() => {
        playTone({ freq: 659.25, duration: 0.18, type: 'sine', volume: 0.09, attack: 0.01 });
      }, 70);
    } catch (e) {}
  }

  function whoosh() {
    playTone({ freq: 220, duration: 0.15, type: 'triangle', volume: 0.05, attack: 0.02 });
  }

  function softError() {
    playTone({ freq: 180, duration: 0.1, type: 'sine', volume: 0.06, attack: 0.01 });
  }

  function setEnabled(val) {
    enabled = !!val;
  }

  function isEnabled() {
    return enabled;
  }

  return { click, success, whoosh, softError, setEnabled, isEnabled };
})();
