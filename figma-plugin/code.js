// Mana BackOffice — HTML to Figma Plugin

// ── Design Tokens ──────────────────────────────────────────────────────────
const C = {
  navy:      { r: 0,     g: 0.278, b: 0.396 },
  navyLight: { r: 0.902, g: 0.941, b: 0.961 },
  navyMid:   { r: 0.702, g: 0.812, b: 0.851 },
  accent:    { r: 0.969, g: 0.851, b: 0.118 },
  bg:        { r: 0.961, g: 0.969, b: 0.980 },
  card:      { r: 1,     g: 1,     b: 1     },
  bdr:       { r: 0.847, g: 0.886, b: 0.918 },
  bdr2:      { r: 0.918, g: 0.941, b: 0.961 },
  ink:       { r: 0.059, g: 0.090, b: 0.165 },
  ink2:      { r: 0.200, g: 0.255, b: 0.353 },
  ink3:      { r: 0.392, g: 0.455, b: 0.545 },
  ink4:      { r: 0.580, g: 0.635, b: 0.722 },
  white:     { r: 1,     g: 1,     b: 1     },
  grayBg:    { r: 0.945, g: 0.961, b: 0.980 },
  gBg:       { r: 0.941, g: 0.992, b: 0.957 },
  gTx:       { r: 0.086, g: 0.396, b: 0.204 },
  gBd:       { r: 0.733, g: 0.969, b: 0.816 },
  aBg:       { r: 1,     g: 0.984, b: 0.922 },
  aTx:       { r: 0.573, g: 0.251, b: 0.055 },
  aBd:       { r: 0.992, g: 0.906, b: 0.541 },
  rBg:       { r: 0.996, g: 0.949, b: 0.949 },
  rTx:       { r: 0.600, g: 0.106, b: 0.106 },
  rBd:       { r: 0.996, g: 0.792, b: 0.792 },
  bBg:       { r: 0.937, g: 0.965, b: 1     },
  bTx:       { r: 0.118, g: 0.251, b: 0.690 },
  bBd:       { r: 0.749, g: 0.859, b: 0.996 },
  pBg:       { r: 0.961, g: 0.953, b: 1     },
  pTx:       { r: 0.357, g: 0.129, b: 0.714 },
};

// ── Load all fonts once ────────────────────────────────────────────────────
async function loadAllFonts() {
  await Promise.all([
    figma.loadFontAsync({ family: "Inter", style: "Regular" }),
    figma.loadFontAsync({ family: "Inter", style: "Medium" }),
    figma.loadFontAsync({ family: "Inter", style: "Semi Bold" }),
    figma.loadFontAsync({ family: "Inter", style: "Bold" }),
  ]);
}

// ── Helpers ────────────────────────────────────────────────────────────────
function mkFrame(name, w, h) {
  const f = figma.createFrame();
  f.name = name;
  f.resize(w, h);
  f.clipsContent = false;
  return f;
}

function mkRect(name, w, h, color, opacity) {
  const r = figma.createRectangle();
  r.name = name;
  r.resize(w, h);
  r.fills = [{ type: "SOLID", color, opacity: opacity !== undefined ? opacity : 1 }];
  return r;
}

function mkText(content, size, color, style, opacity) {
  const t = figma.createText();
  t.fontName = { family: "Inter", style: style || "Regular" };
  t.characters = content;
  t.fontSize = size;
  t.fills = [{ type: "SOLID", color, opacity: opacity !== undefined ? opacity : 1 }];
  t.textAutoResize = "WIDTH_AND_HEIGHT";
  return t;
}

function solidFill(color, opacity) {
  return [{ type: "SOLID", color, opacity: opacity !== undefined ? opacity : 1 }];
}

function solidStroke(color) {
  return [{ type: "SOLID", color }];
}

function corner(node, r) { node.cornerRadius = r; }

// ── Badge ──────────────────────────────────────────────────────────────────
function mkBadge(label, bgColor, txColor) {
  const f = mkFrame("badge", 1, 24);
  f.fills = solidFill(bgColor);
  corner(f, 20);
  f.layoutMode = "HORIZONTAL";
  f.primaryAxisSizingMode = "AUTO";
  f.counterAxisSizingMode = "AUTO";
  f.paddingLeft = 8; f.paddingRight = 8;
  f.paddingTop = 3; f.paddingBottom = 3;
  const t = mkText(label, 11, txColor, "Medium");
  f.appendChild(t);
  return f;
}

// ── Sidebar ────────────────────────────────────────────────────────────────
function buildSidebar(h) {
  const sb = mkFrame("Sidebar", 196, h);
  sb.fills = solidFill(C.navy);
  sb.clipsContent = true;

  // Logo
  const logo = mkFrame("Logo", 28, 28);
  logo.fills = solidFill(C.accent);
  corner(logo, 7);
  logo.x = 18; logo.y = 15;
  sb.appendChild(logo);

  const logoT = mkText("M", 14, C.navy, "Bold");
  logoT.x = 8; logoT.y = 6;
  logo.appendChild(logoT);

  const brandName = mkText("Mana BackOffice", 13, C.white, "Semi Bold");
  brandName.x = 54; brandName.y = 14;
  sb.appendChild(brandName);

  const brandSub = mkText("Operator Web", 10, C.white, "Regular", 0.4);
  brandSub.x = 54; brandSub.y = 31;
  sb.appendChild(brandSub);

  // Divider
  const div1 = mkRect("div", 196, 1, C.white, 0.08);
  div1.x = 0; div1.y = 56;
  sb.appendChild(div1);

  // Section: ภาพรวม
  const lbl1 = mkText("ภาพรวม", 10, C.white, "Medium", 0.35);
  lbl1.x = 18; lbl1.y = 70;
  sb.appendChild(lbl1);

  const nav0 = buildNavItem("ภาพรวม", false);
  nav0.x = 10; nav0.y = 86;
  sb.appendChild(nav0);

  // Section: จัดการ
  const lbl2 = mkText("จัดการ", 10, C.white, "Medium", 0.35);
  lbl2.x = 18; lbl2.y = 130;
  sb.appendChild(lbl2);

  const nav1 = buildNavItem("ผู้ดูแลระบบ", true);
  nav1.x = 10; nav1.y = 146;
  sb.appendChild(nav1);

  const nav2 = buildNavItem("คำขอที่ส่งแล้ว", false);
  nav2.x = 10; nav2.y = 186;
  sb.appendChild(nav2);

  const nav3 = buildNavItem("ตั้งค่าการทำงาน", false);
  nav3.x = 10; nav3.y = 226;
  sb.appendChild(nav3);

  // User bar
  const div2 = mkRect("div-user", 196, 1, C.white, 0.08);
  div2.x = 0; div2.y = h - 54;
  sb.appendChild(div2);

  const av = mkFrame("av", 28, 28);
  av.fills = solidFill(C.white, 0.12);
  corner(av, 14);
  av.x = 18; av.y = h - 42;
  sb.appendChild(av);

  const avT = mkText("OP", 10, C.white, "Semi Bold");
  avT.x = 4; avT.y = 8;
  av.appendChild(avT);

  const uname = mkText("Operator", 12, C.white, "Medium", 0.75);
  uname.x = 54; uname.y = h - 44;
  sb.appendChild(uname);

  const urole = mkText("ผู้ใช้งานเว็บ", 10, C.white, "Regular", 0.35);
  urole.x = 54; urole.y = h - 30;
  sb.appendChild(urole);

  return sb;
}

function buildNavItem(label, isActive) {
  const item = mkFrame("nav-" + label, 176, 32);
  corner(item, 7);
  if (isActive) {
    item.fills = solidFill(C.white, 0.13);
    const bar = mkRect("active-bar", 3, 18, C.accent);
    corner(bar, 3);
    bar.x = 0; bar.y = 7;
    item.appendChild(bar);
  } else {
    item.fills = [];
  }
  const t = mkText(label, 12.5, C.white, "Regular", isActive ? 1 : 0.55);
  t.x = 14; t.y = 8;
  item.appendChild(t);
  return item;
}

// ── Topbar ─────────────────────────────────────────────────────────────────
function buildTopbar(w, title, showCta, ctaLabel) {
  const tb = mkFrame("Topbar", w, 50);
  tb.fills = solidFill(C.card);

  const div = mkRect("border-bottom", w, 1, C.bdr);
  div.x = 0; div.y = 49;
  tb.appendChild(div);

  const ttl = mkText(title, 14, C.ink, "Semi Bold");
  ttl.x = 20; ttl.y = 16;
  tb.appendChild(ttl);

  if (showCta) {
    const btn = mkFrame("cta", 150, 30);
    btn.fills = solidFill(C.navy);
    corner(btn, 7);
    btn.x = w - 162; btn.y = 10;
    const btnT = mkText("+ " + ctaLabel, 12.5, C.white, "Regular");
    btnT.x = 14; btnT.y = 7;
    btn.appendChild(btnT);
    tb.appendChild(btn);
  }

  return tb;
}

// ── Metric card ────────────────────────────────────────────────────────────
function buildMetric(label, value, sub, barColor) {
  const m = mkFrame("metric-" + label, 168, 80);
  m.fills = solidFill(C.card);
  m.strokes = solidStroke(C.bdr);
  m.strokeWeight = 1;
  corner(m, 9);

  const lbl = mkText(label, 11, C.ink3, "Regular");
  lbl.x = 14; lbl.y = 12;
  m.appendChild(lbl);

  const val = mkText(value, 22, C.ink, "Semi Bold");
  val.x = 14; val.y = 28;
  m.appendChild(val);

  const subT = mkText(sub, 10.5, C.ink4, "Regular");
  subT.x = 14; subT.y = 54;
  m.appendChild(subT);

  const bar = mkRect("bar", 168, 3, barColor);
  bar.x = 0; bar.y = 77;
  m.appendChild(bar);

  return m;
}

// ── Filter row ─────────────────────────────────────────────────────────────
function buildFilterRow(tabs, w) {
  const fr = mkFrame("FilterRow", w, 33);
  fr.fills = [];
  let xOff = 0;

  tabs.forEach((label, i) => {
    const isActive = i === 0;
    const tab = mkFrame("tab-" + label, 1, 33);
    tab.fills = solidFill(isActive ? C.navy : C.card);
    tab.strokes = solidStroke(isActive ? C.navy : C.bdr);
    tab.strokeWeight = 1;
    corner(tab, 20);
    tab.layoutMode = "HORIZONTAL";
    tab.primaryAxisSizingMode = "AUTO";
    tab.counterAxisSizingMode = "FIXED";
    tab.paddingLeft = 12; tab.paddingRight = 12;
    tab.paddingTop = 0; tab.paddingBottom = 0;
    const t = mkText(label, 12, isActive ? C.white : C.ink3, "Regular");
    tab.appendChild(t);
    tab.x = xOff; tab.y = 0;
    fr.appendChild(tab);
    xOff += label.length * 8 + 30;
  });

  const sb = mkFrame("Search", 180, 33);
  sb.fills = solidFill(C.card);
  sb.strokes = solidStroke(C.bdr);
  sb.strokeWeight = 1;
  corner(sb, 7);
  sb.x = w - 188; sb.y = 0;
  const st = mkText("ค้นหา...", 12.5, C.ink4, "Regular");
  st.x = 10; st.y = 8;
  sb.appendChild(st);
  fr.appendChild(sb);

  return fr;
}

// ══════════════════════════════════════════════════════════════════════════
// PAGE 1 — ภาพรวม
// ══════════════════════════════════════════════════════════════════════════
function buildDashPage(cW, cH) {
  const page = mkFrame("Page-ภาพรวม", cW, cH);
  page.fills = solidFill(C.bg);

  const metrics = [
    { label: "ผู้ดูแลทั้งหมด", value: "5", sub: "active ทั้งหมด", bar: C.navy },
    { label: "รออนุมัติ",      value: "2", sub: "รอ Mana App",    bar: C.aBd  },
    { label: "อนุมัติวันนี้",   value: "3", sub: "เสร็จสิ้น",      bar: C.gBd  },
    { label: "ถูกปฏิเสธ",      value: "1", sub: "วันนี้",          bar: C.rBd  },
  ];

  metrics.forEach((m, i) => {
    const card = buildMetric(m.label, m.value, m.sub, m.bar);
    card.x = 18 + i * 178; card.y = 18;
    page.appendChild(card);
  });

  // Recent requests card
  const card = mkFrame("RecentRequests", cW - 36, 140);
  card.fills = solidFill(C.card);
  card.strokes = solidStroke(C.bdr);
  card.strokeWeight = 1;
  corner(card, 10);
  card.x = 18; card.y = 116;
  card.clipsContent = true;

  const cardTitle = mkText("คำขอล่าสุด", 13, C.ink, "Semi Bold");
  cardTitle.x = 14; cardTitle.y = 14;
  card.appendChild(cardTitle);

  const rows = [
    { id: "REQ-0341 · แต่งตั้งผู้อนุมัติ", badge: "รออนุมัติ 1/2", bg: C.aBg, tx: C.aTx },
    { id: "REQ-0342 · จ่ายเงินเดือน",       badge: "รออนุมัติ 0/1", bg: C.aBg, tx: C.aTx },
    { id: "REQ-0340 · เพิ่มวงเงินจัดสรร",   badge: "อนุมัติแล้ว",   bg: C.gBg, tx: C.gTx },
  ];

  rows.forEach((r, i) => {
    const y = 40 + i * 32;
    const line = mkRect("line-" + i, cW - 36, 1, C.bdr2);
    line.x = 0; line.y = y - 1;
    card.appendChild(line);

    const lbl = mkText(r.id, 12.5, C.ink3, "Regular");
    lbl.x = 14; lbl.y = y + 8;
    card.appendChild(lbl);

    const b = mkBadge(r.badge, r.bg, r.tx);
    b.x = cW - 36 - 120; b.y = y + 6;
    card.appendChild(b);
  });

  page.appendChild(card);
  return page;
}

// ══════════════════════════════════════════════════════════════════════════
// PAGE 2 — ผู้ดูแลระบบ
// ══════════════════════════════════════════════════════════════════════════
function buildAdminsPage(cW, cH) {
  const page = mkFrame("Page-ผู้ดูแลระบบ", cW, cH);
  page.fills = solidFill(C.bg);

  const fr = buildFilterRow(["ทั้งหมด", "ใช้งานอยู่", "ถูกระงับ"], cW - 36);
  fr.x = 18; fr.y = 18;
  page.appendChild(fr);

  const tW = cW - 36;
  const card = mkFrame("AdminTable", tW, 300);
  card.fills = solidFill(C.card);
  card.strokes = solidStroke(C.bdr);
  card.strokeWeight = 1;
  corner(card, 10);
  card.clipsContent = true;
  card.x = 18; card.y = 65;
  page.appendChild(card);

  // Header
  const hdr = mkFrame("header", tW, 34);
  hdr.fills = solidFill(C.bg);
  hdr.x = 0; hdr.y = 0;
  card.appendChild(hdr);

  const cols = [
    { label: "ผู้ใช้งาน",    x: 14 },
    { label: "สิทธิ์",        x: Math.round(tW * 0.28) + 14 },
    { label: "สถานะ",         x: Math.round(tW * 0.43) + 14 },
    { label: "คำขอล่าสุด",   x: Math.round(tW * 0.58) + 14 },
    { label: "จัดการ",        x: Math.round(tW * 0.86) + 14 },
  ];

  cols.forEach(col => {
    const t = mkText(col.label, 11, C.ink3, "Medium");
    t.x = col.x; t.y = 11;
    hdr.appendChild(t);
  });

  const hdrDiv = mkRect("hdr-div", tW, 1, C.bdr2);
  hdrDiv.x = 0; hdrDiv.y = 33;
  hdr.appendChild(hdrDiv);

  const adminData = [
    { init: "JY", name: "Jirayu Yoodee",  email: "jirayu@mana.co",  role: "ผู้ดูแล",       rBg: C.bBg, rTx: C.bTx, st: "แบบร่าง",    sBg: C.grayBg, sTx: C.ink3, last: "ยังไม่ส่งคำขอ" },
    { init: "DK", name: "Dao Kaew",        email: "dao@mana.co",     role: "ผู้อนุมัติ",    rBg: C.gBg, rTx: C.gTx, st: "รออนุมัติ",  sBg: C.aBg,    sTx: C.aTx,  last: "ส่งไป Mana App แล้ว" },
    { init: "SM", name: "Somsoke Meboon",  email: "somsoke@mana.co", role: "ผู้ดูแล",       rBg: C.bBg, rTx: C.bTx, st: "ใช้งานอยู่", sBg: C.gBg,    sTx: C.gTx,  last: "อนุมัติแล้ว" },
    { init: "EW", name: "Ek Warin",        email: "ek@mana.co",      role: "ผู้ดูแล",       rBg: C.bBg, rTx: C.bTx, st: "ถูกระงับ",   sBg: C.rBg,    sTx: C.rTx,  last: "อนุมัติแล้ว" },
    { init: "TT", name: "Tong Tadthai",    email: "tong@mana.co",    role: "ผู้ดูแลสูงสุด", rBg: C.pBg, rTx: C.pTx, st: "ใช้งานอยู่", sBg: C.gBg,    sTx: C.gTx,  last: "อนุมัติแล้ว" },
  ];

  adminData.forEach((d, i) => {
    const rH = 52;
    const rY = 34 + i * rH;

    const row = mkFrame("row-" + i, tW, rH);
    row.fills = solidFill(C.card);
    row.x = 0; row.y = rY;

    if (i < adminData.length - 1) {
      const div = mkRect("div", tW, 1, C.bdr2);
      div.x = 0; div.y = rH - 1;
      row.appendChild(div);
    }

    const av = mkFrame("av", 28, 28);
    av.fills = solidFill(C.bBg);
    corner(av, 14);
    av.x = 14; av.y = 12;
    const avT = mkText(d.init, 10, C.bTx, "Semi Bold");
    avT.x = 5; avT.y = 8;
    av.appendChild(avT);
    row.appendChild(av);

    const nameT = mkText(d.name, 12.5, C.ink, "Medium");
    nameT.x = 50; nameT.y = 10;
    row.appendChild(nameT);

    const emailT = mkText(d.email, 11, C.ink3, "Regular");
    emailT.x = 50; emailT.y = 26;
    row.appendChild(emailT);

    const roleBadge = mkBadge(d.role, d.rBg, d.rTx);
    roleBadge.x = Math.round(tW * 0.28) + 14;
    roleBadge.y = 15;
    row.appendChild(roleBadge);

    const stBadge = mkBadge(d.st, d.sBg, d.sTx);
    stBadge.x = Math.round(tW * 0.43) + 14;
    stBadge.y = 15;
    row.appendChild(stBadge);

    const lastT = mkText(d.last, 12, C.ink3, "Regular");
    lastT.x = Math.round(tW * 0.58) + 14;
    lastT.y = 18;
    row.appendChild(lastT);

    const btn = mkFrame("btn", 56, 28);
    btn.fills = solidFill(C.card);
    btn.strokes = solidStroke(C.bdr);
    btn.strokeWeight = 1;
    corner(btn, 7);
    btn.x = Math.round(tW * 0.86) + 14;
    btn.y = 12;
    const btnT = mkText("จัดการ", 11.5, C.ink2, "Regular");
    btnT.x = 10; btnT.y = 7;
    btn.appendChild(btnT);
    row.appendChild(btn);

    card.appendChild(row);
  });

  return page;
}

// ══════════════════════════════════════════════════════════════════════════
// PAGE 3 — คำขอที่ส่งแล้ว
// ══════════════════════════════════════════════════════════════════════════
function buildRequestsPage(cW, cH) {
  const page = mkFrame("Page-คำขอ", cW, cH);
  page.fills = solidFill(C.bg);

  const fr = buildFilterRow(["ทั้งหมด", "รออนุมัติ", "อนุมัติแล้ว", "ถูกปฏิเสธ"], cW - 36);
  fr.x = 18; fr.y = 18;
  page.appendChild(fr);

  const banner = mkFrame("Banner", cW - 36, 38);
  banner.fills = solidFill(C.navyLight);
  banner.strokes = solidStroke(C.navyMid);
  banner.strokeWeight = 1;
  corner(banner, 8);
  banner.x = 18; banner.y = 65;
  const bannerT = mkText("ℹ  หน้านี้ใช้ติดตามสถานะเท่านั้น — การอนุมัติ/ปฏิเสธทำใน Mana App", 12, C.navy, "Regular");
  bannerT.x = 12; bannerT.y = 10;
  banner.appendChild(bannerT);
  page.appendChild(banner);

  const tW = cW - 36;
  const card = mkFrame("RequestsTable", tW, 282);
  card.fills = solidFill(C.card);
  card.strokes = solidStroke(C.bdr);
  card.strokeWeight = 1;
  corner(card, 10);
  card.clipsContent = true;
  card.x = 18; card.y = 117;
  page.appendChild(card);

  // Header
  const hdr = mkFrame("header", tW, 34);
  hdr.fills = solidFill(C.bg);
  hdr.x = 0; hdr.y = 0;

  const hCols = [
    { label: "เลขที่",        xRatio: 0 },
    { label: "รายการ",        xRatio: 0.11 },
    { label: "ผู้ส่งคำขอ",   xRatio: 0.33 },
    { label: "สถานะ",         xRatio: 0.51 },
    { label: "ความคืบหน้า",  xRatio: 0.66 },
    { label: "Actions",       xRatio: 0.88 },
  ];
  hCols.forEach(col => {
    const t = mkText(col.label, 11, C.ink3, "Medium");
    t.x = Math.round(tW * col.xRatio) + 14; t.y = 11;
    hdr.appendChild(t);
  });
  const hdrDiv = mkRect("hdr-div", tW, 1, C.bdr2);
  hdrDiv.x = 0; hdrDiv.y = 33;
  hdr.appendChild(hdrDiv);
  card.appendChild(hdr);

  const reqData = [
    { id: "REQ-0341", name: "แต่งตั้งผู้อนุมัติ",  by: "Somchai P.", sBg: C.aBg, sTx: C.aTx, st: "รออนุมัติ",   prog: 50,  done: "1/2", barColor: C.navy, action: "ติดตาม"   },
    { id: "REQ-0342", name: "จ่ายเงินเดือน",         by: "Priya R.",   sBg: C.aBg, sTx: C.aTx, st: "รออนุมัติ",   prog: 0,   done: "0/1", barColor: C.navy, action: "ติดตาม"   },
    { id: "REQ-0340", name: "เพิ่มวงเงินจัดสรร",    by: "Napat W.",   sBg: C.gBg, sTx: C.gTx, st: "อนุมัติแล้ว", prog: 100, done: "2/2", barColor: C.gTx,  action: "ดูผล"     },
    { id: "REQ-0339", name: "ลดวงเงินจัดสรร",        by: "Somchai P.", sBg: C.rBg, sTx: C.rTx, st: "ถูกปฏิเสธ",   prog: 0,   done: "0/2", barColor: C.rTx,  action: "ดูเหตุผล" },
  ];

  reqData.forEach((d, i) => {
    const rH = 58;
    const rY = 34 + i * rH;

    const row = mkFrame("row-" + i, tW, rH);
    row.fills = solidFill(C.card);
    row.x = 0; row.y = rY;

    if (i < reqData.length - 1) {
      const div = mkRect("div", tW, 1, C.bdr2);
      div.x = 0; div.y = rH - 1;
      row.appendChild(div);
    }

    const idT = mkText(d.id, 12, C.navy, "Semi Bold");
    idT.x = 14; idT.y = 21;
    row.appendChild(idT);

    const nameT = mkText(d.name, 12, C.ink, "Regular");
    nameT.x = Math.round(tW * 0.11) + 14; nameT.y = 21;
    row.appendChild(nameT);

    const byT = mkText(d.by, 12, C.ink, "Regular");
    byT.x = Math.round(tW * 0.33) + 14; byT.y = 21;
    row.appendChild(byT);

    const stB = mkBadge(d.st, d.sBg, d.sTx);
    stB.x = Math.round(tW * 0.51) + 14; stB.y = 18;
    row.appendChild(stB);

    // Progress bar
    const progBg = mkFrame("prog-bg", 80, 4);
    progBg.fills = solidFill(C.bdr2);
    corner(progBg, 4);
    progBg.x = Math.round(tW * 0.66) + 14; progBg.y = 28;

    const fillW = Math.max(d.prog === 0 ? 0 : 2, Math.round(80 * d.prog / 100));
    if (fillW > 0) {
      const fill = mkRect("fill", fillW, 4, d.barColor);
      corner(fill, 4);
      fill.x = 0; fill.y = 0;
      progBg.appendChild(fill);
    }
    row.appendChild(progBg);

    const doneT = mkText(d.done, 11, C.ink3, "Regular");
    doneT.x = Math.round(tW * 0.66) + 100; doneT.y = 24;
    row.appendChild(doneT);

    const btn = mkFrame("btn", 70, 28);
    btn.fills = solidFill(C.card);
    btn.strokes = solidStroke(C.bdr);
    btn.strokeWeight = 1;
    corner(btn, 7);
    btn.x = Math.round(tW * 0.88) + 14; btn.y = 15;
    const btnT = mkText(d.action, 11.5, C.ink2, "Regular");
    btnT.x = 8; btnT.y = 7;
    btn.appendChild(btnT);
    row.appendChild(btn);

    card.appendChild(row);
  });

  return page;
}

// ══════════════════════════════════════════════════════════════════════════
// PAGE 4 — ตั้งค่าการทำงาน
// ══════════════════════════════════════════════════════════════════════════
function buildSettingsPage(cW, cH) {
  const page = mkFrame("Page-Settings", cW, cH);
  page.fills = solidFill(C.bg);
  page.clipsContent = true;

  const listW = cW - 340;
  const detW = 340;

  // Operation list
  const opList = mkFrame("OpList", listW, cH);
  opList.fills = solidFill(C.bg);
  opList.clipsContent = true;
  opList.x = 0; opList.y = 0;

  const sections = [
    { cat: "ผู้ดูแลระบบ", items: [
      { name: "แต่งตั้งผู้ดูแลสูงสุด",  code: "Admin.AssignSuperAdmin",  from: "เจ้าของร้าน",                  to: "เจ้าของร้าน + ผู้ดูแลสูงสุด",     toBg: C.pBg, toTx: C.pTx },
      { name: "แต่งตั้งผู้อนุมัติ",      code: "Admin.AssignAdmin",        from: "เจ้าของร้าน / ผู้ดูแลสูงสุด",  to: "เจ้าของร้าน + ผู้อนุมัติ 1 คน",  toBg: C.navyLight, toTx: C.navy },
      { name: "แต่งตั้งผู้ดูแล",         code: "Admin.AssignOperator",     from: "ผู้อนุมัติ",                    to: "ผู้อนุมัติ 1 คน",                  toBg: C.navyLight, toTx: C.navy },
    ]},
    { cat: "พนักงาน", items: [
      { name: "จัดการพนักงาน", code: "Employee.Manage", from: "ผู้ดูแล", to: "ไม่ต้องอนุมัติ", toBg: C.gBg, toTx: C.gTx },
    ]},
    { cat: "เงินเดือน / Allocation", items: [
      { name: "จ่ายเงินเดือน",     code: "Payroll.Payout",      from: "ผู้ดูแล", to: "ผู้อนุมัติ 1 คน", toBg: C.aBg, toTx: C.aTx },
      { name: "เพิ่มวงเงินจัดสรร", code: "Allocation.Increase", from: "ผู้ดูแล", to: "ผู้อนุมัติ 2 คน", toBg: C.rBg, toTx: C.rTx },
      { name: "ลดวงเงินจัดสรร",    code: "Allocation.Decrease", from: "ผู้ดูแล", to: "ผู้อนุมัติ 2 คน", toBg: C.rBg, toTx: C.rTx },
    ]},
  ];

  let yOff = 16;
  sections.forEach(section => {
    const catT = mkText(section.cat.toUpperCase(), 11, C.ink3, "Semi Bold");
    catT.x = 16; catT.y = yOff;
    opList.appendChild(catT);

    const catLine = mkRect("cat-line", listW - 80, 1, C.bdr);
    catLine.x = 72; catLine.y = yOff + 8;
    opList.appendChild(catLine);

    yOff += 26;

    section.items.forEach((item, i) => {
      const isFirst = i === 0 && section === sections[0];

      const card = mkFrame("op-" + item.code, listW - 20, 80);
      card.fills = solidFill(isFirst ? { r: 0.973, g: 0.984, b: 0.992 } : C.card);
      card.strokes = solidStroke(isFirst ? C.navy : C.bdr);
      card.strokeWeight = 1;
      corner(card, 9);
      card.x = 10; card.y = yOff;

      const nameT = mkText(item.name, 13, C.ink, "Medium");
      nameT.x = 14; nameT.y = 12;
      card.appendChild(nameT);

      const codeT = mkText(item.code, 10.5, C.ink3, "Regular");
      codeT.x = 14; codeT.y = 30;
      card.appendChild(codeT);

      const fromB = mkBadge(item.from, C.grayBg, C.ink3);
      fromB.x = 14; fromB.y = 50;
      card.appendChild(fromB);

      const arrT = mkText("→", 11, C.ink4, "Regular");
      arrT.x = 14 + item.from.length * 7 + 22; arrT.y = 53;
      card.appendChild(arrT);

      const toB = mkBadge(item.to, item.toBg, item.toTx);
      toB.x = 14 + item.from.length * 7 + 38; toB.y = 50;
      card.appendChild(toB);

      // Toggle
      const tgl = mkFrame("toggle", 34, 20);
      tgl.fills = solidFill(C.navy);
      corner(tgl, 20);
      tgl.x = listW - 54; tgl.y = 30;
      const knob = mkRect("knob", 14, 14, C.white);
      corner(knob, 7);
      knob.x = 17; knob.y = 3;
      tgl.appendChild(knob);
      card.appendChild(tgl);

      opList.appendChild(card);
      yOff += 88;
    });
    yOff += 8;
  });

  // Detail panel
  const detail = mkFrame("DetailPanel", detW, cH);
  detail.fills = solidFill(C.card);
  detail.x = listW; detail.y = 0;

  const detBorder = mkRect("border", 1, cH, C.bdr);
  detBorder.x = 0; detBorder.y = 0;
  detail.appendChild(detBorder);

  const emptyT = mkText("เลือก operation\nเพื่อดูและแก้ไข", 12.5, C.ink4, "Regular");
  emptyT.x = 100; emptyT.y = cH / 2 - 20;
  emptyT.textAlignHorizontal = "CENTER";
  detail.appendChild(emptyT);

  page.appendChild(opList);
  page.appendChild(detail);
  return page;
}

// ══════════════════════════════════════════════════════════════════════════
// DRAWER — เพิ่มผู้ดูแล
// ══════════════════════════════════════════════════════════════════════════
function buildDrawer() {
  const dW = 360;
  const dH = 560;
  const drawer = mkFrame("Drawer-เพิ่มผู้ดูแล", dW, dH);
  drawer.fills = solidFill(C.card);
  drawer.strokes = solidStroke(C.bdr);
  drawer.strokeWeight = 1;
  corner(drawer, 0);

  // Stripe
  const stripe = mkRect("stripe", dW, 3, C.navy);
  stripe.x = 0; stripe.y = 0;
  drawer.appendChild(stripe);

  // Header
  const title = mkText("เพิ่มผู้ดูแลระบบ", 14, C.ink, "Semi Bold");
  title.x = 16; title.y = 18;
  drawer.appendChild(title);

  const sub = mkText("สร้างคำขอแต่งตั้ง → ส่งไป Mana App", 11.5, C.ink3, "Regular");
  sub.x = 16; sub.y = 38;
  drawer.appendChild(sub);

  const hdrDiv = mkRect("hdr-div", dW, 1, C.bdr);
  hdrDiv.x = 0; hdrDiv.y = 58;
  drawer.appendChild(hdrDiv);

  let y = 72;

  // Field: ผู้ใช้งาน
  const lbl1 = mkText("ผู้ใช้งาน", 11, C.ink3, "Semi Bold");
  lbl1.x = 16; lbl1.y = y;
  drawer.appendChild(lbl1);
  y += 18;

  const inp1 = mkFrame("input-user", dW - 32, 36);
  inp1.fills = solidFill(C.bg);
  inp1.strokes = solidStroke(C.bdr);
  inp1.strokeWeight = 1;
  corner(inp1, 7);
  inp1.x = 16; inp1.y = y;
  const ph1 = mkText("ค้นหาชื่อ / อีเมล...", 12.5, C.ink4, "Regular");
  ph1.x = 11; ph1.y = 10;
  inp1.appendChild(ph1);
  drawer.appendChild(inp1);
  y += 44;

  // Field: สิทธิ์
  const lbl2 = mkText("สิทธิ์ที่ต้องการแต่งตั้ง", 11, C.ink3, "Semi Bold");
  lbl2.x = 16; lbl2.y = y;
  drawer.appendChild(lbl2);
  y += 18;

  ["ผู้ดูแล (Operator)", "ผู้อนุมัติ (Admin)", "ผู้ดูแลสูงสุด (SuperAdmin)"].forEach((opt, i) => {
    const isSel = i === 1;
    const optF = mkFrame("opt-" + i, dW - 32, 36);
    optF.fills = solidFill(isSel ? C.navy : C.card);
    optF.strokes = solidStroke(isSel ? C.navy : C.bdr);
    optF.strokeWeight = 1;
    corner(optF, 7);
    optF.x = 16; optF.y = y;

    const dot = mkFrame("dot", 8, 8);
    dot.fills = [];
    dot.strokes = solidStroke(isSel ? C.white : C.bdr);
    dot.strokeWeight = 1.5;
    corner(dot, 4);
    dot.x = 11; dot.y = 14;
    optF.appendChild(dot);

    const optT = mkText(opt, 12.5, isSel ? C.white : C.ink2, "Regular");
    optT.x = 28; optT.y = 10;
    optF.appendChild(optT);

    drawer.appendChild(optF);
    y += 42;
  });
  y += 4;

  // Field: เหตุผล
  const lbl3 = mkText("เหตุผล", 11, C.ink3, "Semi Bold");
  lbl3.x = 16; lbl3.y = y;
  drawer.appendChild(lbl3);
  y += 18;

  const ta = mkFrame("textarea", dW - 32, 70);
  ta.fills = solidFill(C.bg);
  ta.strokes = solidStroke(C.bdr);
  ta.strokeWeight = 1;
  corner(ta, 7);
  ta.x = 16; ta.y = y;
  const taP = mkText("ระบุเหตุผล...", 12.5, C.ink4, "Regular");
  taP.x = 11; taP.y = 10;
  ta.appendChild(taP);
  drawer.appendChild(ta);
  y += 78;

  // Rule box
  const ruleBox = mkFrame("rule-box", dW - 32, 62);
  ruleBox.fills = solidFill(C.navyLight);
  ruleBox.strokes = solidStroke(C.navyMid);
  ruleBox.strokeWeight = 1;
  corner(ruleBox, 8);
  ruleBox.x = 16; ruleBox.y = y;

  const ruleLbl = mkText("Admin.AssignAdmin", 11, C.navy, "Medium");
  ruleLbl.x = 12; ruleLbl.y = 10;
  ruleBox.appendChild(ruleLbl);

  const ruleVal = mkText("เจ้าของร้าน + ผู้อนุมัติ 1 คน", 13, C.navy, "Semi Bold");
  ruleVal.x = 12; ruleVal.y = 30;
  ruleBox.appendChild(ruleVal);
  drawer.appendChild(ruleBox);

  // Footer
  const footer = mkFrame("footer", dW, 52);
  footer.fills = solidFill(C.bg);
  footer.x = 0; footer.y = dH - 52;

  const footDiv = mkRect("foot-div", dW, 1, C.bdr);
  footDiv.x = 0; footDiv.y = 0;
  footer.appendChild(footDiv);

  const sendBtn = mkFrame("btn-send", 180, 30);
  sendBtn.fills = solidFill(C.navy);
  corner(sendBtn, 7);
  sendBtn.x = 16; sendBtn.y = 11;
  const sendT = mkText("ส่งคำขอไป Mana App", 12.5, C.white, "Regular");
  sendT.x = 14; sendT.y = 7;
  sendBtn.appendChild(sendT);
  footer.appendChild(sendBtn);

  const cancelBtn = mkFrame("btn-cancel", 72, 30);
  cancelBtn.fills = solidFill(C.card);
  cancelBtn.strokes = solidStroke(C.bdr);
  cancelBtn.strokeWeight = 1;
  corner(cancelBtn, 7);
  cancelBtn.x = 204; cancelBtn.y = 11;
  const cancelT = mkText("ยกเลิก", 12.5, C.ink2, "Regular");
  cancelT.x = 14; cancelT.y = 7;
  cancelBtn.appendChild(cancelT);
  footer.appendChild(cancelBtn);

  drawer.appendChild(footer);
  return drawer;
}

// ══════════════════════════════════════════════════════════════════════════
// MAIN
// ══════════════════════════════════════════════════════════════════════════
async function main() {
  await loadAllFonts();

  const SW = 1280, SH = 720;
  const SB = 196, TB = 50;
  const CW = SW - SB, CH = SH - TB;
  const GAP = 80;

  const screens = [
    { name: "01 ภาพรวม",           title: "ภาพรวม",           cta: false, ctaLabel: "",              buildFn: buildDashPage     },
    { name: "02 ผู้ดูแลระบบ",      title: "ผู้ดูแลระบบ",      cta: true,  ctaLabel: "เพิ่มผู้ดูแล",   buildFn: buildAdminsPage   },
    { name: "03 คำขอที่ส่งแล้ว",   title: "คำขอที่ส่งแล้ว",   cta: false, ctaLabel: "",              buildFn: buildRequestsPage },
    { name: "04 ตั้งค่าการทำงาน",  title: "ตั้งค่าการทำงาน",  cta: false, ctaLabel: "",              buildFn: buildSettingsPage },
  ];

  for (let i = 0; i < screens.length; i++) {
    const s = screens[i];
    const screen = mkFrame(s.name, SW, SH);
    screen.fills = solidFill(C.bg);
    screen.x = i * (SW + GAP);
    screen.y = 0;

    screen.appendChild(buildSidebar(SH));

    const tb = buildTopbar(CW, s.title, s.cta, s.ctaLabel);
    tb.x = SB; tb.y = 0;
    screen.appendChild(tb);

    const content = s.buildFn(CW, CH);
    content.x = SB; content.y = TB;
    screen.appendChild(content);

    figma.currentPage.appendChild(screen);
  }

  // Screen 5 — Drawer open
  const screen5 = mkFrame("02 ผู้ดูแลระบบ + Drawer", SW, SH);
  screen5.fills = solidFill(C.bg);
  screen5.x = screens.length * (SW + GAP);
  screen5.y = 0;
  screen5.clipsContent = true;

  screen5.appendChild(buildSidebar(SH));

  const tb5 = buildTopbar(CW, "ผู้ดูแลระบบ", true, "เพิ่มผู้ดูแล");
  tb5.x = SB; tb5.y = 0;
  screen5.appendChild(tb5);

  const content5 = buildAdminsPage(CW, CH);
  content5.x = SB; content5.y = TB;
  screen5.appendChild(content5);

  const ov = mkRect("overlay", CW, CH, C.ink, 0.1);
  ov.x = SB; ov.y = TB;
  screen5.appendChild(ov);

  const drawer = buildDrawer();
  drawer.x = SW - 360; drawer.y = TB;
  screen5.appendChild(drawer);

  figma.currentPage.appendChild(screen5);

  figma.viewport.scrollAndZoomIntoView(figma.currentPage.children);
  figma.closePlugin("✅ สร้าง 5 screens เสร็จแล้ว!");
}

main().catch(err => figma.closePlugin("❌ Error: " + err.message));
