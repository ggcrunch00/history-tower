// 3단원 시대별 배경 섬. 구역마다 2개(A: 그 구역 1층 근처, B: 2층 근처)
// 만드는 법은 scenery.js 맨 위 설명과 같음. SC(scenery.js)·SC2(scenery2.js)를 같이 씀

const SC3 = {
  // 깃대에 단 태극기
  flag(m, x, z, h = 4) {
    m.b(0.15, h, 0.15, "#5e3b1f", x, 0, z);
    flagBoard(m, x + 0.8, h - 1.1, z, 1.5);
  },
  // 벽돌 건물 (층수만큼 창문 줄)
  brick(m, x, z, w, d, floors, color = "#a8573f") {
    m.b(w, floors * 1.6, d, color, x, 0, z);
    for (let f = 0; f < floors; f++) for (let k = 0; k < Math.floor(w / 1.4); k++) m.b(0.7, 0.9, 0.08, "#e9e2d0", x - w / 2 + 0.9 + k * 1.4, 0.4 + f * 1.6, z + d / 2);
    m.b(w + 0.4, 0.3, d + 0.4, "#6e675d", x, floors * 1.6, z);
  },
  // 팔각정 (탑골 공원)
  pavilion(m, x, z) {
    m.cyl(2.6, 2.8, 0.6, "#a8a196", x, 0.3, z, 8);
    for (let k = 0; k < 8; k++) { const a = (k / 8) * Math.PI * 2; m.b(0.25, 2.2, 0.25, "#b33a2e", x + Math.cos(a) * 2.1, 0.6, z + Math.sin(a) * 2.1); }
    m.cyl(1.2, 3.0, 0.9, "#4a4f57", x, 3.2, z, 8);
    m.cyl(0.6, 1.6, 0.8, "#555a62", x, 4.0, z, 8);
    m.cone(0.4, 0.8, "#3a3f47", x, 4.8, z, 8);
  },
  // 철조망 울타리
  fence(m, w, z) {
    for (let x = -w / 2; x <= w / 2 + 0.01; x += 2) m.b(0.2, 1.8, 0.2, "#6e5a44", x, 0, z);
    for (const y of [0.5, 1.0, 1.5]) m.b(w, 0.05, 0.05, "#8a8a8a", 0, y, z);
  },
  // 들꽃
  flowers(m, x, z) {
    [[0, 0, "#f2c94c"], [0.5, 0.3, "#ff8fab"], [-0.4, 0.4, "#ffffff"], [0.2, -0.5, "#f2c94c"], [-0.6, -0.3, "#ff8fab"]].forEach(([dx, dz, c]) => {
      m.b(0.06, 0.4, 0.06, "#4f9e48", x + dx, 0, z + dz);
      m.b(0.25, 0.2, 0.25, c, x + dx, 0.4, z + dz);
    });
  },
};

const SCENERY_3 = [
  { zone: 0, slot: "A", title: "의병 마을", sub: "나라를 지키려 일어선 사람들",
    build(m) { SC.base(m, 13, 10); SC2.choga(m, -3, -1.8); SC2.choga(m, 2.2, -2.4); m.artifact("hwaseungchong", 1.6, 2.6, 0, 2.4); SC.tree(m, -5, 3, 2.6); } },
  { zone: 0, slot: "B", title: "하얼빈역", sub: "안중근이 의거를 일으킨 곳",
    build(m) { SC.base(m, 14, 10); SC2.rails(m, 13, 2.6); SC3.brick(m, -1, -2, 8, 3, 2, "#b5523a"); m.artifact("yumuk", 2.4, 5, 0, -0.5); } },
  { zone: 1, slot: "A", title: "만주 삼원보", sub: "신흥 무관 학교에서 독립군을 길렀어요",
    build(m) { SC.base(m, 14, 11); m.artifact("sinheung", 3.6, -1, 0, -1.5); SC.field(m, 3.5, 3, 4, 3); SC.tree(m, -5.5, 3.2, 2.6); } },
  { zone: 1, slot: "B", title: "경성의 거리", sub: "기차역과 토막집",
    build(m) { SC.base(m, 14, 10); m.artifact("gyeongseong", 3.6, -1.5, 0, -1.8); m.artifact("tomak", 1.6, 4.4, 0, 2.6); SC2.pole(m, -5.5, 3); SC2.pole(m, 0.5, 3.5); } },
  { zone: 2, slot: "A", title: "탑골 공원", sub: "독립 선언서를 읽고 만세를 외친 곳",
    build(m) { SC.base(m, 13, 10); SC3.pavilion(m, -1, -0.8); SC3.flag(m, 3.8, 2.6); SC3.flag(m, -4.6, 2.8, 3.4); SC.tree(m, 4.6, -3, 2.6); } },
  { zone: 2, slot: "B", title: "상하이 임시 정부", sub: "대한민국 임시 정부 청사",
    build(m) { SC.base(m, 13, 10); SC3.brick(m, -1, -1.5, 7, 3.4, 3); SC3.flag(m, 3.6, 2.6, 3.6); m.artifact("dongnipsinmun", 1.6, -4, 0, 2.8); } },
  { zone: 3, slot: "A", title: "청산리", sub: "독립군이 크게 이긴 곳",
    build(m) { SC.base(m, 14, 11); [[-5, -3, 3.4], [-2, -3.6, 3], [1.5, -3.4, 3.6], [4.8, -2.6, 3], [-5.4, 1.4, 2.6]].forEach(([x, z, h]) => SC.tree(m, x, z, h)); m.artifact("seomyeong", 3.2, 2, 0, 2.2); } },
  { zone: 3, slot: "B", title: "조선어 학회", sub: "우리말 사전을 만든 곳",
    build(m) { SC.base(m, 13, 10); SC2.giwa(m, -1.4, -1.6, 5.6, 3.2); m.artifact("keunsajeon", 1.8, 3.8, 0, 2.6); SC.tree(m, -5, 3, 2.4); } },
  { zone: 4, slot: "A", title: "광복의 거리", sub: "태극기를 들고 만세를 불렀어요",
    build(m) { SC.base(m, 14, 10); [-5, -2.5, 0, 2.5, 5].forEach((x, i) => SC3.flag(m, x, i % 2 ? -1.5 : 1.5, 3.4 + (i % 2) * 0.6)); SC3.flowers(m, -3.6, 3.4); SC3.flowers(m, 3.8, 3.6); } },
  { zone: 4, slot: "B", title: "제헌 국회", sub: "선거로 뽑힌 의원들이 헌법을 만들었어요",
    build(m) { SC.base(m, 14, 10); SC3.brick(m, -1, -2, 9, 3.2, 2, "#d8cfb8"); m.artifact("tupyoham", 1.6, 3, 0, 2.6); m.artifact("jeheon", 1.8, -3.8, 0, 2.6); } },
  { zone: 5, slot: "A", title: "피란 수도 부산", sub: "판잣집과 천막 학교",
    build(m) { SC.base(m, 14, 11); m.artifact("panjatjip", 2.6, -2.6, 0, -2); m.artifact("cheonmak", 2.4, 3, 0, 2); SC.water(m, 0, 4.6, 14, 1.6); } },
  { zone: 5, slot: "B", title: "휴전선", sub: "평화를 기다리는 곳",
    build(m) { SC.base(m, 14, 10); SC3.fence(m, 12, 0); m.artifact("jeongjeon", 2.2, -3.4, 0, -2.8); SC3.flowers(m, 2, 2.6); SC3.flowers(m, -2.6, 3.2); SC3.flowers(m, 4.6, -2.6); SC.tree(m, 5, 3, 2.4); } },
];
