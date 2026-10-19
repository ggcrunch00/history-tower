// 시대별 배경 섬. 탑 바깥쪽 공중에 떠 있고, 구역마다 2개(A: 그 구역 1층 근처, B: 2층 근처)
// build(m)의 m 사용법은 artifacts.js 맨 위 설명과 같음. 섬 윗면이 y = 0, +z 쪽이 탑을 바라봄
// m.artifact(유물 id, 높이, x, 바닥y, z, 회전y): artifacts.js의 유물 모델을 크게 세워 놓음

const SC = {
  base(m, w, d) {
    m.b(w, 1, d, "#6dbb5a", 0, -1, 0);
    m.b(w - 1, 1.2, d - 1, "#8a6a4a", 0, -2.2, 0);
    m.b(w - 3, 1.2, d - 3, "#7d7468", 0, -3.4, 0);
    m.b(w - 6, 1, d - 6, "#6c645a", 0, -4.4, 0);
  },
  tree(m, x, z, h = 3) {
    m.b(0.7, h, 0.7, "#7a5230", x, 0, z);
    m.b(2.6, 2.2, 2.6, "#4f9e48", x, h - 0.4, z);
    m.b(1.6, 1, 1.6, "#5fb556", x, h + 1.8, z);
  },
  makjip(m, x, z) {
    for (let i = 0; i < 5; i++) m.b(5 - i, 0.9, 4.2, i % 2 ? "#a07a50" : "#8a6640", x, i * 0.9, z);
    m.b(1.2, 1.5, 0.2, "#33261a", x, 0, z + 2.15);
  },
  fire(m, x, z) {
    for (let k = 0; k < 7; k++) { const a = (k / 7) * Math.PI * 2; m.b(0.6, 0.4, 0.6, "#7d776d", x + Math.cos(a) * 1.1, 0, z + Math.sin(a) * 1.1); }
    m.b(1.6, 0.3, 0.3, "#5e3b1f", x, 0.05, z, 0.6);
    m.b(1.6, 0.3, 0.3, "#5e3b1f", x, 0.05, z, -0.6);
    m.b(0.8, 1.0, 0.8, "#f08c2e", x, 0.3, z);
    m.b(0.5, 1.2, 0.5, "#ffd04a", x, 0.5, z);
    m.b(0.3, 0.6, 0.3, "#fff1a8", x, 1.5, z);
  },
  cave(m, x, z) {
    m.b(7, 2, 5, "#857d72", x, 0, z - 1);
    m.b(6, 2, 4.4, "#958d82", x, 2, z - 1.2);
    m.b(4.4, 1.6, 3.6, "#857d72", x, 4, z - 1.4);
    m.b(2.4, 2.8, 0.2, "#2b2622", x, 0, z + 1.55);
  },
  umjip(m, x, z, s = 1) {
    m.cyl(2.4 * s, 2.4 * s, 0.6 * s, "#7d6a55", x, 0.3 * s, z, 10);
    m.cone(2.9 * s, 3.4 * s, "#c9a55a", x, 0.6 * s + 1.7 * s, z, 10);
    m.b(0.9 * s, 1.3 * s, 0.3, "#33261a", x, 0.4 * s, z + 2.35 * s);
  },
  water(m, x, z, w, d) { m.b(w, 0.2, d, "#4aa3df", x, -0.08, z); },
  field(m, x, z, w, rows) {
    m.b(w + 0.6, 0.12, rows * 0.8 + 0.4, "#7a6a4a", x, 0, z);
    for (let i = 0; i < rows; i++) m.b(w, 0.6, 0.45, i % 2 ? "#c9b84a" : "#9ccc4a", x, 0.1, z - (rows - 1) * 0.4 + i * 0.8);
  },
  house(m, x, z) {
    m.b(3.2, 1.4, 2.4, "#a07a50", x, 0, z);
    for (let i = 0; i < 3; i++) m.b(3.8, 0.45, 3.0 - i * 0.9, "#c9a55a", x, 1.4 + i * 0.45, z);
    m.b(0.8, 1.1, 0.2, "#33261a", x, 0, z + 1.25);
  },
  wall(m) {
    m.b(11, 2.6, 1.4, "#8f877a", 0, 0, 0);
    for (let i = 0; i < 6; i++) m.b(0.9, 0.7, 1.4, "#a39b8e", -5 + i * 2, 2.6, 0);
    m.b(2.0, 1.9, 1.5, "#3a2f25", 0, 0, 0.02);
    m.b(3.2, 0.5, 1.8, "#7d7569", 0, 1.9, 0);
    const flags = [["#c0392b", -3.5], ["#2e86de", 0], ["#e1a800", 3.5]];   // 고구려·백제·신라를 나타내는 깃발
    flags.forEach(([c, x]) => { m.b(0.18, 3.2, 0.18, "#5e3b1f", x, 3.3, 0); m.b(1.4, 0.9, 0.1, c, x + 0.75, 5.4, 0); });
  },
  hall(m, x, z, wallColor = "#efe6d2", pillar = "#b33a2e") {
    m.b(8, 0.8, 5, "#b9b2a6", x, 0, z);
    [[-3, -1.8], [3, -1.8], [-3, 1.8], [3, 1.8], [-1, 1.8], [1, 1.8]].forEach(([px, pz]) => m.b(0.4, 2.6, 0.4, pillar, x + px, 0.8, z + pz));
    m.b(6, 2.2, 3.2, wallColor, x, 0.8, z);
    m.b(9, 0.5, 6, "#4a4f57", x, 3.4, z);
    m.b(7.6, 0.5, 4.8, "#53585f", x, 3.9, z);
    m.b(5.6, 0.5, 3.0, "#4a4f57", x, 4.4, z);
    m.b(6.2, 0.4, 0.6, "#3a3f47", x, 4.9, z);
  },
  ship(m, x, z, s = 1) {
    m.b(6 * s, 0.9 * s, 2.2 * s, "#7a5230", x, 0.1, z);
    m.b(1.2 * s, 0.9 * s, 1.6 * s, "#7a5230", x + 3.4 * s, 0.4, z);
    m.b(5.4 * s, 0.3 * s, 2.0 * s, "#9c6a3d", x, 1.0 * s, z);
    m.b(0.3, 5 * s, 0.3, "#5e3b1f", x, 1.0 * s, z);
    m.b(0.15, 3.2 * s, 2.8 * s, "#f1ead6", x + 0.3, 2.2 * s, z);
  },
  kiln(m, x, z) {
    for (let i = 0; i < 5; i++) m.b(1.7, 1.2 + i * 0.25, 2.0, i % 2 ? "#8e5a35" : "#9c6a42", x - 3 + i * 1.6, 0, z);
    m.b(0.8, 0.7, 0.2, "#f08c2e", x - 3, 0.1, z + 1.02);
    m.b(0.5, 1.6, 0.5, "#6e4226", x + 4.1, 1.0, z);
  },
};

const SCENERY = [
  { zone: 0, slot: "A", title: "구석기 마을", sub: "막집과 모닥불",
    build(m) { SC.base(m, 13, 10); SC.makjip(m, -2.5, -1); SC.fire(m, 2.8, 1.5); SC.tree(m, 4.5, -3); SC.tree(m, -5, 3, 2.6); } },
  { zone: 0, slot: "B", title: "동굴과 바위 그늘", sub: "옮겨 다니며 살던 곳",
    build(m) { SC.base(m, 13, 10); SC.cave(m, -1.5, -1); m.artifact("jumeokdoki", 2.6, 3.8, 0, 2.2, 0.3); SC.tree(m, 4.5, -3); } },
  { zone: 1, slot: "A", title: "신석기 마을", sub: "움집을 짓고 정착했어요",
    build(m) { SC.base(m, 13, 10); SC.umjip(m, -3, -1.5); SC.umjip(m, 2.5, -2, 0.8); m.artifact("bitsal", 2.6, 3.5, 0, 2.6); } },
  { zone: 1, slot: "B", title: "강가의 생활", sub: "농사짓고 물고기를 잡았어요",
    build(m) { SC.base(m, 13, 10); SC.water(m, 0, 3, 13, 3); SC.umjip(m, -3, -2, 0.8); SC.field(m, 3, -2, 4, 4); } },
  { zone: 2, slot: "A", title: "고인돌", sub: "청동기 시대 지배자의 무덤",
    build(m) { SC.base(m, 13, 10); m.artifact("goindol", 3.6, 0, 0, 0); SC.tree(m, -5, -3); SC.tree(m, 5, -2.5, 2.6); } },
  { zone: 2, slot: "B", title: "벼농사", sub: "반달 돌칼로 이삭을 땄어요",
    build(m) { SC.base(m, 13, 10); SC.field(m, 1.5, 0.5, 7, 7); SC.house(m, -4.2, -2); } },
  { zone: 3, slot: "A", title: "삼국의 성", sub: "고구려·백제·신라",
    build(m) { SC.base(m, 13, 8); SC.wall(m); } },
  { zone: 3, slot: "B", title: "한강", sub: "삼국이 차지하려고 다툰 곳",
    build(m) { SC.base(m, 13, 10); SC.water(m, 0, 0.5, 13, 4); SC.ship(m, -1, 0.5, 0.6); SC.tree(m, -4.5, -3.5); SC.tree(m, 4, 3.8, 2.4); } },
  { zone: 4, slot: "A", title: "불국사", sub: "통일 신라의 불교문화",
    build(m) { SC.base(m, 14, 11); SC.hall(m, -2, -2); m.artifact("seokgatap", 5, 4.2, 0, 1.5); } },
  { zone: 4, slot: "B", title: "발해", sub: "바다 동쪽의 번성한 나라",
    build(m) { SC.base(m, 14, 11); SC.hall(m, -2, -2, "#e9e2d0", "#8c3a2e"); m.artifact("seokdeung", 4.2, 4.3, 0, 1.8); } },
  { zone: 5, slot: "A", title: "고려청자", sub: "상감 기법으로 만든 청자",
    build(m) { SC.base(m, 13, 10); SC.kiln(m, -1, -2.5); m.artifact("cheongja", 3.4, 3.5, 0, 2.2); } },
  { zone: 5, slot: "B", title: "벽란도", sub: "외국 상인이 오가던 무역항",
    build(m) { SC.base(m, 14, 10); SC.water(m, 0, 2, 14, 6); SC.ship(m, -2.5, 2, 0.7); SC.ship(m, 3.2, 2.6, 0.5); m.b(14, 0.6, 2, "#9c6a3d", 0, 0, -3.5); } },
];
