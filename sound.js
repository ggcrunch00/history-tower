// 배경음악·효과음 (Web Audio로 직접 합성 → 음원 파일 없음, 저작권 걱정 없음, 인터넷 필요 없음)
// 국악 평조 느낌의 5음 음계(솔·라·도·레·미)로 만든 잔잔한 반복곡 + 장구 느낌의 작은 북소리
// 소리 크기는 아래 VOLUME 값으로 조절 (0 ~ 1)
const GameSound = (() => {
  const VOLUME = { master: 0.28, music: 0.55, sfx: 0.9 };
  const STORE_KEY = "historyTower.muted";

  let ctx = null, master, musicBus, sfxBus, timer = 0;
  let muted = false;
  try { muted = localStorage.getItem(STORE_KEY) === "1"; } catch { /* 저장이 막힌 환경 */ }

  // 음 높이 (MIDI 번호): 솔3 라3 도4 레4 미4 솔4 라4 도5 레5 미5
  const S = [55, 57, 60, 62, 64, 67, 69, 72, 74, 76];
  // 가락: [음계 번호, 길이(8분음표 개수)], 한 마디 = 8. null은 쉼표
  const MELODY = [
    [[5, 2], [6, 1], [7, 1], [6, 2], [5, 2]],
    [[4, 2], [5, 1], [4, 1], [3, 4]],
    [[3, 1], [4, 1], [5, 2], [6, 2], [7, 2]],
    [[6, 2], [4, 2], [5, 4]],
    [[7, 2], [8, 2], [9, 2], [8, 2]],
    [[7, 2], [6, 1], [7, 1], [6, 4]],
    [[5, 1], [6, 1], [5, 1], [4, 1], [3, 2], [4, 2]],
    [[4, 2], [3, 2], [5, 2], [null, 2]],
  ];
  const BASS = [43, 48, 50, 43, 48, 45, 50, 43];   // 마디마다 낮은 음
  const events = [];   // 8분음표 칸 번호 → 가락 음
  MELODY.forEach((bar, b) => {
    let pos = 0;
    bar.forEach(([deg, len]) => { if (deg !== null) events[b * 8 + pos] = { midi: S[deg], len }; pos += len; });
  });
  const STEPS = MELODY.length * 8;
  let bpm = 82, step = 0, nextTime = 0, zone = 0;

  const freq = (midi) => 440 * Math.pow(2, (midi - 69) / 12);

  function init() {
    if (ctx) return true;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = muted ? 0 : VOLUME.master;
    master.connect(ctx.destination);
    musicBus = ctx.createGain(); musicBus.gain.value = VOLUME.music; musicBus.connect(master);
    sfxBus = ctx.createGain(); sfxBus.gain.value = VOLUME.sfx; sfxBus.connect(master);
    document.addEventListener("visibilitychange", () => {
      if (!ctx) return;
      if (document.hidden) ctx.suspend(); else ctx.resume();
    });
    return true;
  }

  // 가야금처럼 튕기는 소리
  function pluck(midi, t, dur, gain, bus, bright = 2400) {
    const o1 = ctx.createOscillator(), o2 = ctx.createOscillator();
    const g = ctx.createGain(), f = ctx.createBiquadFilter();
    o1.type = "triangle"; o1.frequency.value = freq(midi);
    o2.type = "sine"; o2.frequency.value = freq(midi + 12);
    const g2 = ctx.createGain(); g2.gain.value = 0.25;
    f.type = "lowpass"; f.frequency.value = bright;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + Math.min(1.4, dur));
    o1.connect(f); o2.connect(g2); g2.connect(f); f.connect(g); g.connect(bus);
    o1.start(t); o2.start(t); o1.stop(t + dur + 0.05); o2.stop(t + dur + 0.05);
  }
  function soft(midi, t, dur, gain, bus, type = "sine") {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.value = freq(midi);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + 0.05);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(bus);
    o.start(t); o.stop(t + dur + 0.05);
  }
  // 장구 '덩' (낮은 울림)
  function drum(t, gain) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(120, t);
    o.frequency.exponentialRampToValueAtTime(55, t + 0.15);
    g.gain.setValueAtTime(gain, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);
    o.connect(g); g.connect(musicBus);
    o.start(t); o.stop(t + 0.3);
  }
  // 장구 '덕' (가벼운 딱 소리)
  let noiseBuf = null;
  function tap(t, gain) {
    if (!noiseBuf) {
      noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 0.1, ctx.sampleRate);
      const d = noiseBuf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    const s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    s.buffer = noiseBuf;
    f.type = "bandpass"; f.frequency.value = 1800; f.Q.value = 1.2;
    g.gain.setValueAtTime(gain, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);
    s.connect(f); f.connect(g); g.connect(musicBus);
    s.start(t); s.stop(t + 0.08);
  }

  function scheduleStep(i, t) {
    const eighth = 60 / bpm / 2;
    const ev = events[i];
    if (ev) pluck(ev.midi, t, ev.len * eighth * 1.6, 0.32, musicBus);
    if (i % 8 === 0) {   // 마디 시작: 낮은 음 + 5도 위 음을 길게
      const root = BASS[(i / 8) % BASS.length];
      soft(root, t, eighth * 7.5, 0.22, musicBus);
      soft(root + 7, t, eighth * 7.5, 0.08, musicBus, "triangle");
    }
    if (i % 4 === 0) drum(t, i % 8 === 0 ? 0.32 : 0.2);
    if (i % 4 === 3 && zone >= 2) tap(t, 0.05);   // 위로 올라갈수록 장단이 조금씩 풍성해짐
    if (i % 2 === 1 && zone >= 4) tap(t, 0.03);
  }
  function tick() {
    while (nextTime < ctx.currentTime + 0.3) {
      scheduleStep(step, nextTime);
      nextTime += 60 / bpm / 2;
      step = (step + 1) % STEPS;
    }
  }

  const SFX = {
    correct(t) { pluck(76, t, 0.5, 0.5, sfxBus, 4000); pluck(79, t + 0.09, 0.7, 0.5, sfxBus, 4000); },
    wrong(t) { soft(62, t, 0.25, 0.35, sfxBus, "triangle"); soft(57, t + 0.18, 0.45, 0.35, sfxBus, "triangle"); },
    card(t) { [84, 88, 91, 96].forEach((m, i) => soft(m, t + i * 0.06, 0.35, 0.18, sfxBus)); },
    zone(t) { [72, 74, 76, 79].forEach((m, i) => pluck(m, t + i * 0.1, 0.6, 0.4, sfxBus, 3500)); },
    fall(t) {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = "sine";
      o.frequency.setValueAtTime(520, t);
      o.frequency.exponentialRampToValueAtTime(130, t + 0.4);
      g.gain.setValueAtTime(0.25, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.45);
      o.connect(g); g.connect(sfxBus);
      o.start(t); o.stop(t + 0.5);
    },
    bounce(t) {   // 점프대: 뿅 하고 올라가는 소리
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = "triangle";
      o.frequency.setValueAtTime(260, t);
      o.frequency.exponentialRampToValueAtTime(1040, t + 0.3);
      g.gain.setValueAtTime(0.3, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.4);
      o.connect(g); g.connect(sfxBus);
      o.start(t); o.stop(t + 0.45);
    },
    bonk(t) {   // 회전 막대에 맞음: 쿵 + 띠용
      drum(t, 0.6);
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = "square";
      o.frequency.setValueAtTime(700, t);
      o.frequency.exponentialRampToValueAtTime(180, t + 0.25);
      g.gain.setValueAtTime(0.12, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);
      o.connect(g); g.connect(sfxBus);
      o.start(t); o.stop(t + 0.35);
    },
    bonus(t) { [79, 84, 79, 88].forEach((m, i) => soft(m, t + i * 0.08, 0.3, 0.2, sfxBus, "triangle")); },
    fanfare(t) {
      [67, 72, 74, 76, 79].forEach((m, i) => pluck(m, t + i * 0.12, 0.6, 0.45, sfxBus, 4000));
      [67, 72, 76, 79].forEach((m) => pluck(m, t + 0.75, 1.6, 0.3, sfxBus, 4000));
      [0, 0.25, 0.5, 0.62].forEach((d) => drum(t + d, 0.4));
    },
  };

  return {
    // 첫 클릭(시작 버튼) 때 불러야 함: 브라우저는 사용자가 누르기 전에는 소리를 막음
    start() {
      if (!init()) return;
      ctx.resume();
      if (!timer) {
        nextTime = ctx.currentTime + 0.1;
        step = 0;
        timer = setInterval(tick, 100);
      }
    },
    play(name) {
      if (!ctx || muted || !SFX[name]) return;
      SFX[name](ctx.currentTime + 0.01);
    },
    setZone(z) { zone = z; bpm = 82 + z * 3; },
    get muted() { return muted; },
    setMuted(m) {
      muted = m;
      try { localStorage.setItem(STORE_KEY, m ? "1" : "0"); } catch { /* 저장이 막힌 환경 */ }
      if (ctx) master.gain.setTargetAtTime(m ? 0 : VOLUME.master, ctx.currentTime, 0.05);
    },
  };
})();
