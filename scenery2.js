// 2단원 시대별 배경 섬. 구역마다 2개(A: 그 구역 1층 근처, B: 2층 근처)
// 만드는 법은 scenery.js 맨 위 설명과 같음. SC(땅·나무·물·밭 등)는 scenery.js 것을 같이 씀

const SC2 = {
  // 기와집 한 채 (돌 기단 + 흰 벽 + 기와지붕)
  giwa(m, x, z, w = 5, d = 3.2) {
    m.b(w + 0.6, 0.6, d + 0.6, "#a8a196", x, 0, z);
    m.b(w, 1.8, d, "#f1ead6", x, 0.6, z);
    for (const px of [-w / 2, 0, w / 2]) m.b(0.25, 1.9, 0.25, "#7a5230", x + px, 0.6, z + d / 2);
    m.b(w + 1.4, 0.4, d + 1.6, "#4a4f57", x, 2.4, z);
    m.b(w + 0.4, 0.4, d + 0.6, "#555a62", x, 2.8, z);
    m.b(w - 0.6, 0.35, 0.4, "#3a3f47", x, 3.2, z);
  },
  // 초가집 (볏짚 지붕)
  choga(m, x, z) {
    m.b(3.6, 1.5, 2.6, "#d8c39a", x, 0, z);
    m.b(0.9, 1.1, 0.1, "#5e3b1f", x, 0, z + 1.31);
    m.b(4.4, 0.6, 3.4, "#c9a55a", x, 1.5, z);
    m.b(3.8, 0.5, 2.6, "#d4b36a", x, 2.1, z);
    m.b(2.6, 0.4, 1.6, "#c9a55a", x, 2.6, z);
  },
  // 장독대: 돌 단 위의 장독들
  jangdok(m, x, z) {
    m.b(3.4, 0.4, 2.2, "#a8a196", x, 0, z);
    [[-1, -0.4, 0.55], [0, -0.4, 0.65], [1, -0.4, 0.5], [-0.5, 0.5, 0.45], [0.6, 0.5, 0.4]].forEach(([dx, dz, r]) => {
      m.cyl(r * 0.8, r * 0.7, r * 1.6, "#7a4a2a", x + dx, 0.4 + r * 0.8, z + dz, 10);
      m.cyl(r * 0.55, r * 0.55, 0.12, "#5c3519", x + dx, 0.4 + r * 1.66, z + dz, 10);
    });
  },
  // 성벽과 문루 (가운데 문 위에 누각)
  fortress(m, w = 11) {
    m.b(w, 2.4, 1.6, "#9a9184", 0, 0, 0);
    for (let i = 0; i < Math.floor(w / 1.6); i++) m.b(1.0, 0.7, 1.6, "#aaa194", -w / 2 + 0.8 + i * 1.6, 2.4, 0);
    m.b(1.8, 1.9, 1.7, "#3a2f25", 0, 0, 0.02);
    m.b(3.6, 1.2, 2.2, "#b33a2e", 0, 2.4, 0);
    m.b(4.6, 0.4, 3.2, "#4a4f57", 0, 3.6, 0);
    m.b(3.4, 0.4, 2.2, "#555a62", 0, 4.0, 0);
    m.b(2.6, 0.3, 0.4, "#3a3f47", 0, 4.4, 0);
  },
  // 장터 가게 (차양과 물건)
  stall(m, x, z, cloth = "#e9dcc0") {
    [[-1.2, -0.8], [1.2, -0.8], [-1.2, 0.8], [1.2, 0.8]].forEach(([dx, dz]) => m.b(0.15, 2.2, 0.15, "#7a5230", x + dx, 0, z + dz));
    m.b(3, 0.15, 2.2, cloth, x, 2.2, z);
    m.b(2.4, 0.8, 1.4, "#9c6a3d", x, 0, z);
    [["#e5484d", -0.6], ["#f2c94c", 0], ["#4f9e48", 0.6]].forEach(([c, dx]) => m.b(0.5, 0.35, 0.5, c, x + dx, 0.8, z));
  },
  // 서양 증기선 (검은 배와 굴뚝)
  steamship(m, x, z, s = 1) {
    m.b(7 * s, 1.1 * s, 2.2 * s, "#2b2b2b", x, 0.1, z);
    m.b(4 * s, 0.9 * s, 1.6 * s, "#efe9dc", x - 0.5 * s, 1.2 * s, z);
    m.b(0.6 * s, 1.8 * s, 0.6 * s, "#8a2f2a", x + 0.6 * s, 2.1 * s, z);
    m.b(0.15, 3.4 * s, 0.15, "#3a3a3a", x - 2.2 * s, 1.2 * s, z);
  },
  // 전봇대와 전깃줄, 가로등
  pole(m, x, z) {
    m.b(0.25, 5, 0.25, "#6e5a44", x, 0, z);
    m.b(1.6, 0.15, 0.15, "#6e5a44", x, 4.6, z);
  },
  lamp(m, x, z) {
    m.b(0.18, 3.4, 0.18, "#2b2b2b", x, 0, z);
    m.b(0.6, 0.6, 0.6, "#fff1a8", x, 3.4, z);
    m.b(0.8, 0.15, 0.8, "#2b2b2b", x, 4.0, z);
  },
  rails(m, w, z) {
    m.b(w, 0.15, 2.2, "#9a9184", 0, 0, z);
    for (const dz of [-0.6, 0.6]) m.b(w, 0.12, 0.15, "#5a5f67", 0, 0.15, z + dz);
  },
  // 커다란 글자 조각: 상자 조각 목록 [가로, 세로, x, y]
  letter(m, parts, x, z, color) {
    parts.forEach(([w, h, lx, ly]) => m.b(w, h, 0.8, color, x + lx, ly, z));
  },
};

const SCENERY_2 = [
  { zone: 0, slot: "A", title: "경복궁", sub: "도읍 한양에 지은 궁궐",
    build(m) { SC.base(m, 14, 11); m.artifact("geunjeongjeon", 4.6, -1, 0, -1.5); SC.tree(m, 5.2, 3.2, 2.6); SC.tree(m, -5.5, 3.4, 2.4); } },
  { zone: 0, slot: "B", title: "성균관과 향교", sub: "유교를 가르치던 학교",
    build(m) { SC.base(m, 13, 10); SC2.giwa(m, -1, -1.5, 6, 3.4); SC.tree(m, 4, 2.6, 3.6); SC.tree(m, -4.6, 2.8, 3.2); } },
  { zone: 1, slot: "A", title: "과학 기구", sub: "측우기와 앙부일구",
    build(m) { SC.base(m, 13, 10); SC.field(m, -2.5, -1.5, 5, 5); m.artifact("chugugi", 3.2, 3.2, 0, -1.6); m.artifact("angbu", 2.2, 3.4, 0, 2.6); } },
  { zone: 1, slot: "B", title: "훈민정음", sub: "백성을 위해 만든 글자",
    build(m) {
      SC.base(m, 14, 10);
      const C = "#2e5fa8";
      SC2.letter(m, [[2.6, 0.7, 0, 3.1], [0.7, 3.8, 0.95, 0]], -4.2, -1, C);                         // ㄱ
      SC2.letter(m, [[0.7, 3.8, -0.95, 0], [2.6, 0.7, 0, 0]], -0.8, -1, "#c0392b");                  // ㄴ
      SC2.letter(m, [[0.7, 3.8, -0.95, 0], [0.7, 3.8, 0.95, 0], [2.6, 0.7, 0, 0], [2.6, 0.7, 0, 3.1]], 2.6, -1, "#3f8f6a");   // ㅁ
      m.artifact("hunmin", 2.4, 5, 0, 2.6, -0.3);
    } },
  { zone: 2, slot: "A", title: "양반집", sub: "사랑채와 안채",
    build(m) { SC.base(m, 14, 11); m.artifact("sarangchae", 3.4, -2, 0, 1.2); SC2.giwa(m, 2.6, -2.8, 4.4, 2.6); SC.tree(m, 5.4, 3, 2.6); } },
  { zone: 2, slot: "B", title: "서민 마을", sub: "초가집과 장독대",
    build(m) { SC.base(m, 13, 10); SC2.choga(m, -3, -1.6); SC2.choga(m, 2.4, -2.4); SC2.jangdok(m, 2.6, 2.2); SC.tree(m, -4.8, 3, 2.4); } },
  { zone: 3, slot: "A", title: "남해 바다", sub: "이순신과 조선 수군",
    build(m) { SC.base(m, 14, 11); SC.water(m, 0, 0.5, 14, 8); m.artifact("geobukseon", 2.4, -2.4, 0, 0.5, Math.PI / 2); m.artifact("panokseon", 2.8, 3, 0, -0.4); } },
  { zone: 3, slot: "B", title: "남한산성", sub: "병자호란 때 47일을 버틴 곳",
    build(m) { SC.base(m, 14, 10); m.artifact("namhan", 4, 0, 0, -0.5); SC.tree(m, -5.6, 3, 2.6); SC.tree(m, 5.6, 3.2, 2.4); } },
  { zone: 4, slot: "A", title: "수원 화성", sub: "정약용의 거중기로 쌓은 성",
    build(m) { SC.base(m, 14, 10); SC2.fortress(m, 12); m.artifact("geojunggi", 2.8, 3.6, 0, 2.6); } },
  { zone: 4, slot: "B", title: "장시", sub: "보부상이 오가던 시장",
    build(m) { SC.base(m, 13, 10); SC2.stall(m, -3.2, -1.6); SC2.stall(m, 0.4, -1.8, "#cfe6df"); SC2.jangdok(m, 3.6, 2.4); m.artifact("sangpyeong", 1.8, -3, 0, 2.6); } },
  { zone: 5, slot: "A", title: "강화도", sub: "서양 배가 들어오고 문을 연 곳",
    build(m) { SC.base(m, 14, 10); SC.water(m, 0, 2.4, 14, 5); SC2.steamship(m, 2, 2.4, 0.7); m.artifact("cheokhwa", 3, -4, 0, -2); SC.tree(m, 0, -3, 2.4); } },
  { zone: 5, slot: "B", title: "근대 문물", sub: "전차와 전등이 들어왔어요",
    build(m) { SC.base(m, 14, 10); SC2.rails(m, 13, 1.5); m.artifact("jeoncha", 2.8, -0.5, 0.27, 1.5); SC2.pole(m, -5, -2.5); SC2.pole(m, 0, -2.5); SC2.pole(m, 5, -2.5); SC2.lamp(m, 4.6, 3.6); SC2.lamp(m, -4.6, 3.6); } },
];
