// Mana BackOffice — HTML to Figma Plugin
// Run this in Figma: Plugins > Development > New Plugin (use manifest.json)

// ── Design Tokens ──────────────────────────────────────────────────────────
const C = {
  navy:       { r: 0,    g: 0.278, b: 0.396 },  // #004765
  navy2:      { r: 0,    g: 0.204, b: 0.290 },  // #00334a
  navyLight:  { r: 0.902,g: 0.941, b: 0.961 },  // #e6f0f5
  navyMid:    { r: 0.702,g: 0.812, b: 0.851 },  // #b3cfd9
  accent:     { r: 0.969,g: 0.851, b: 0.118 },  // #F7D91E
  bg:         { r: 0.961,g: 0.969, b: 0.980 },  // #F5F7FA
  card:       { r: 1,    g: 1,     b: 1     },  // #fff
  bdr:        { r: 0.847,g: 0.886, b: 0.918 },  // #D8E2EA
  bdr2:       { r: 0.918,g: 0.941, b: 0.961 },  // #eaf0f5
  ink:        { r: 0.059,g: 0.090, b: 0.165 },  // #0F172A
  ink2:       { r: 0.200,g: 0.255, b: 0.353 },  // #334155
  ink3:       { r: 0.392,g: 0.455, b: 0.545 },  // #64748B
  ink4:       { r: 0.580,g: 0.635, b: 0.722 },  // #94A3B8
  white:      { r: 1,    g: 1,     b: 1     },
  // status
  gBg:        { r: 0.941,g: 0.992, b: 0.957 },  // #f0fdf4
  gTx:        { r: 0.086,g: 0.396, b: 0.204 },  // #166534
  gBd:        { r: 0.733,g: 0.969, b: 0.816 },  // #bbf7d0
  aBg:        { r: 1,    g: 0.984, b: 0.922 },  // #fffbeb
  aTx:        { r: 0.573,g: 0.251, b: 0.055 },  // #92400e
  aBd:        { r: 0.992,g: 0.906, b: 0.541 },  // #fde68a
  rBg:        { r: 0.996,g: 0.949, b: 0.949 },  // #fef2f2
  rTx:        { r: 0.600,g: 0.106, b: 0.106 },  // #991b1b
  rBd:        { r: 0.996,g: 0.792, b: 0.792 },  // #fecaca
  bBg:        { r: 0.937,g: 0.965, b: 1     },  // #eff6ff
  bTx:        { r: 0.118,g: 0.251, b: 0.690 },  // #1e40af
  bBd:        { r: 0.749,g: 0.859, b: 0.996 },  // #bfdbfe
  pBg:        { r: 0.961,g: 0.953, b: 1     },  // #f5f3ff
  pTx:        { r: 0.357,g: 0.129, b: 0.714 },  // #5b21b6
  pBd:        { r: 0.867,g: 0.839, b: 0.996 },  // #ddd6fe
  grayBg:     { r: 0.945,g: 0.961, b: 0.980 },  // #f1f5f9
};

function rgb(c, a = 1) { return { ...c, a }; }

// ── Helpers ────────────────────────────────────────────────────────────────
async function loadFont(family = "Inter", style = "Regular") {
  await figma.loadFontAsync({ family, style });
}

function frame(name, w, h) {
  const f = figma.createFrame();
  f.name = name; f.resize(w, h);
  return f;
}

function rect(name, w, h, fill) {
  const r = figma.createRectangle();
  r.name = name; r.resize(w, h);
  r.fills = [{ type: "SOLID", color: fill }];
  return r;
}

async function text(content, size, color, weight = "Regular", w = null) {
  await loadFont("Inter", weight);
  const t = figma.createText();
  t.fontName = { family: "Inter", style: weight };
  t.characters = content;
  t.fontSize = size;
  t.fills = [{ type: "SOLID", color }];
  if (w) { t.textAutoResize = "HEIGHT"; t.resize(w, 20); }
  return t;
}

function setFill(node, color, opacity = 1) {
  node.fills = [{ type: "SOLID", color, opacity }];
}

function setStroke(node, color, weight = 1) {
  node.strokes = [{ type: "SOLID", color }];
  node.strokeWeight = weight;
}

function setBorderRadius(node, r) {
  node.cornerRadius = r;
}

function setAutoLayout(node, dir = "HORIZONTAL", gap = 0, padH = 0, padV = 0) {
  node.layoutMode = dir;
  node.itemSpacing = gap;
  node.paddingLeft = padH; node.paddingRight = padH;
  node.paddingTop = padV; node.paddingBottom = padV;
  node.primaryAxisSizingMode = "FIXED";
  node.counterAxisSizingMode = "AUTO";
}

// ── Badge ──────────────────────────────────────────────────────────────────
async function badge(label, bgColor, txColor) {
  const f = frame(`badge-${label}`, 1, 1);
  setFill(f, bgColor);
  setBorderRadius(f, 20);
  f.layoutMode = "HORIZONTAL";
  f.primaryAxisSizingMode = "AUTO";
  f.counterAxisSizingMode = "AUTO";
  f.paddingLeft = 8; f.paddingRight = 8;
  f.paddingTop = 3; f.paddingBottom = 3;
  const t = await text(label, 11, txColor, "Medium");
  f.appendChild(t);
  return f;
}

// ── Sidebar ────────────────────────────────────────────────────────────────
async function buildSidebar(h) {
  const sb = frame("Sidebar", 196, h);
  setFill(sb, C.navy);
  sb.clipsContent = true;

  // Brand
  const brand = frame("Brand", 196, 58);
  setFill(brand, C.navy);
  brand.x = 0; brand.y = 0;

  const logoBox = frame("Logo", 28, 28);
  setFill(logoBox, C.accent);
  setBorderRadius(logoBox, 7);
  logoBox.x = 18; logoBox.y = 15;

  const brandName = await text("Mana BackOffice", 13, C.white, "SemiBold");
  brandName.x = 55; brandName.y = 15;

  const brandSub = await text("Operator Web", 10, C.white, "Regular");
  brandSub.fills = [{ type: "SOLID", color: C.white, opacity: 0.4 }];
  brandSub.x = 55; brandSub.y = 32;

  const brandDiv = rect("divider", 196, 1, C.white);
  brandDiv.fills = [{ type: "SOLID", color: C.white, opacity: 0.08 }];
  brandDiv.x = 0; brandDiv.y = 57;

  brand.appendChild(logoBox);
  brand.appendChild(brandName);
  brand.appendChild(brandSub);
  brand.appendChild(brandDiv);

  // Section label
  async function sectionLabel(lbl, y) {
    const t = await text(lbl, 10, C.white, "Medium");
    t.fills = [{ type: "SOLID", color: C.white, opacity: 0.35 }];
    t.x = 18; t.y = y;
    return t;
  }

  // Nav item
  async function navItem(label, y, isActive = false) {
    const item = frame(`nav-${label}`, 176, 32);
    item.x = 10; item.y = y;
    setBorderRadius(item, 7);
    if (isActive) {
      setFill(item, C.white);
      item.fills = [{ type: "SOLID", color: C.white, opacity: 0.13 }];
    } else {
      item.fills = [];
    }

    const t = await text(label, 12.5, isActive ? C.white : C.white, "Regular");
    if (!isActive) t.fills = [{ type: "SOLID", color: C.white, opacity: 0.55 }];
    t.x = 33; t.y = 8;
    item.appendChild(t);

    if (isActive) {
      const bar = rect("active-bar", 3, 18, C.accent);
      setBorderRadius(bar, 3);
      bar.x = 0; bar.y = 7;
      item.appendChild(bar);
    }
    return item;
  }

  // Labels & items
  const lbl1 = await sectionLabel("ภาพรวม", 78);
  const nav1 = await navItem("ภาพรวม", 94);

  const lbl2 = await sectionLabel("จัดการ", 140);
  const nav2 = await navItem("ผู้ดูแลระบบ", 156, true);
  const nav3 = await navItem("คำขอที่ส่งแล้ว", 196);
  const nav4 = await navItem("ตั้งค่าการทำงาน", 236);

  // User bar
  const userDiv = rect("user-divider", 196, 1, C.white);
  userDiv.fills = [{ type: "SOLID", color: C.white, opacity: 0.08 }];
  userDiv.x = 0; userDiv.y = h - 53;

  const avBg = frame("avatar", 28, 28);
  setFill(avBg, C.white);
  avBg.fills = [{ type: "SOLID", color: C.white, opacity: 0.12 }];
  setBorderRadius(avBg, 14);
  avBg.x = 18; avBg.y = h - 40;

  const avTxt = await text("OP", 10, C.white, "SemiBold");
  avTxt.x = 22; avTxt.y = h - 34;

  const uname = await text("Operator", 12, C.white, "Medium");
  uname.fills = [{ type: "SOLID", color: C.white, opacity: 0.75 }];
  uname.x = 54; uname.y = h - 42;

  const urole = await text("ผู้ใช้งานเว็บ", 10, C.white, "Regular");
  urole.fills = [{ type: "SOLID", color: C.white, opacity: 0.35 }];
  urole.x = 54; urole.y = h - 28;

  [brand, lbl1, nav1, lbl2, nav2, nav3, nav4, userDiv, avBg, avTxt, uname, urole]
    .forEach(n => sb.appendChild(n));

  return sb;
}

// ── Topbar ─────────────────────────────────────────────────────────────────
async function buildTopbar(w, title, showCta = false, ctaLabel = "") {
  const tb = frame("Topbar", w, 50);
  setFill(tb, C.card);
  setStroke(tb, C.bdr);
  tb.strokeAlign = "INSIDE";
  tb.strokes = []; // bottom only simulation via rect

  const div = rect("border-bottom", w, 1, C.bdr);
  div.x = 0; div.y = 49;

  const ttl = await text(title, 14, C.ink, "SemiBold");
  ttl.x = 20; ttl.y = 17;

  tb.appendChild(div);
  tb.appendChild(ttl);

  if (showCta) {
    const btn = frame("btn-primary", 120, 30);
    setFill(btn, C.navy);
    setBorderRadius(btn, 7);
    btn.x = w - 140; btn.y = 10;

    const btnTxt = await text(`+ ${ctaLabel}`, 12.5, C.white, "Regular");
    btnTxt.x = 14; btnTxt.y = 7;
    btn.appendChild(btnTxt);
    tb.appendChild(btn);
  }

  return tb;
}

// ── Metric Card ────────────────────────────────────────────────────────────
async function buildMetric(label, value, sub, barColor, x) {
  const m = frame(`metric-${label}`, 168, 80);
  setFill(m, C.card);
  setStroke(m, C.bdr);
  setBorderRadius(m, 9);
  m.x = x;

  const lbl = await text(label, 11, C.ink3, "Regular");
  lbl.x = 14; lbl.y = 14;

  const val = await text(value, 22, C.ink, "SemiBold");
  val.x = 14; val.y = 30;

  const subT = await text(sub, 10.5, C.ink4, "Regular");
  subT.x = 14; subT.y = 57;

  const bar = rect("bottom-bar", 168, 3, barColor);
  bar.x = 0; bar.y = 77;

  [lbl, val, subT, bar].forEach(n => m.appendChild(n));
  return m;
}

// ── Table Row ──────────────────────────────────────────────────────────────
async function buildTableRow(cells, widths, y, isHeader = false) {
  const totalW = widths.reduce((a, b) => a + b, 0);
  const rowH = isHeader ? 34 : 46;
  const row = frame(isHeader ? "thead-row" : `row-${y}`, totalW, rowH);
  if (isHeader) setFill(row, C.bg);
  else setFill(row, C.card);

  if (!isHeader) {
    const div = rect("row-divider", totalW, 1, C.bdr2);
    div.x = 0; div.y = rowH - 1;
    row.appendChild(div);
  }

  let xOff = 0;
  for (let i = 0; i < cells.length; i++) {
    const t = await text(cells[i], isHeader ? 11 : 12.5,
      isHeader ? C.ink3 : C.ink,
      isHeader ? "Medium" : "Regular");
    t.x = xOff + 14;
    t.y = isHeader ? 11 : 15;
    row.appendChild(t);
    xOff += widths[i];
  }

  if (isHeader) {
    const div = rect("header-divider", totalW, 1, C.bdr2);
    div.x = 0; div.y = rowH - 1;
    row.appendChild(div);
  }

  return row;
}

// ── Filter Row ─────────────────────────────────────────────────────────────
async function buildFilterRow(tabs, w) {
  const fr = frame("FilterRow", w, 33);
  fr.fills = [];
  let xOff = 0;

  for (let i = 0; i < tabs.length; i++) {
    const tab = frame(`tab-${tabs[i]}`, 0, 33);
    tab.layoutMode = "HORIZONTAL";
    tab.primaryAxisSizingMode = "AUTO";
    tab.counterAxisSizingMode = "FIXED";
    tab.resize(1, 33);
    tab.paddingLeft = 12; tab.paddingRight = 12;
    setBorderRadius(tab, 20);
    setStroke(tab, i === 0 ? C.navy : C.bdr);

    if (i === 0) setFill(tab, C.navy);
    else setFill(tab, C.card);

    const t = await text(tabs[i], 12, i === 0 ? C.white : C.ink3, "Regular");
    t.y = 8;
    tab.appendChild(t);
    tab.x = xOff; tab.y = 0;
    fr.appendChild(tab);

    const tabW = tabs[i].length * 8 + 24;
    xOff += tabW + 6;
  }

  // Search box
  const sb = frame("SearchBox", 180, 33);
  setFill(sb, C.card);
  setStroke(sb, C.bdr);
  setBorderRadius(sb, 7);
  sb.x = w - 188; sb.y = 0;

  const sT = await text("🔍  ค้นหา...", 12.5, C.ink4, "Regular");
  sT.x = 10; sT.y = 8;
  sb.appendChild(sT);
  fr.appendChild(sb);

  return fr;
}

// ══════════════════════════════════════════════════════════════════════════
// PAGE 1 — Dashboard (ภาพรวม)
// ══════════════════════════════════════════════════════════════════════════
async function buildDashPage(contentW, contentH) {
  const page = frame("Page — ภาพรวม", contentW, contentH);
  setFill(page, C.bg);

  // Metrics row
  const metrics = [
    { label: "ผู้ดูแลทั้งหมด", value: "5",  sub: "active ทั้งหมด", bar: C.navy },
    { label: "รออนุมัติ",      value: "2",  sub: "รอ Mana App",    bar: C.aBd  },
    { label: "อนุมัติวันนี้",   value: "3",  sub: "เสร็จสิ้น",      bar: C.gBd  },
    { label: "ถูกปฏิเสธ",      value: "1",  sub: "วันนี้",          bar: C.rBd  },
  ];

  for (let i = 0; i < metrics.length; i++) {
    const m = await buildMetric(
      metrics[i].label, metrics[i].value, metrics[i].sub,
      metrics[i].bar, 18 + i * 178
    );
    m.y = 18;
    page.appendChild(m);
  }

  // Recent requests card
  const card = frame("RecentRequests", contentW - 36, 140);
  setFill(card, C.card);
  setStroke(card, C.bdr);
  setBorderRadius(card, 10);
  card.x = 18; card.y = 116;

  const cardTitle = await text("คำขอล่าสุด", 13, C.ink, "SemiBold");
  cardTitle.x = 14; cardTitle.y = 14;

  const rows = [
    { id: "REQ-0341 · แต่งตั้งผู้อนุมัติ", badge: "รออนุมัติ 1/2", bg: C.aBg, tx: C.aTx },
    { id: "REQ-0342 · จ่ายเงินเดือน",      badge: "รออนุมัติ 0/1", bg: C.aBg, tx: C.aTx },
    { id: "REQ-0340 · เพิ่มวงเงินจัดสรร",  badge: "อนุมัติแล้ว",   bg: C.gBg, tx: C.gTx },
  ];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const y = 40 + i * 32;
    const rowLine = rect(`row-divider-${i}`, contentW - 36, 1, C.bdr2);
    rowLine.x = 0; rowLine.y = y - 1;
    card.appendChild(rowLine);

    const lbl = await text(row.id, 12.5, C.ink3, "Regular");
    lbl.x = 14; lbl.y = y + 8;
    card.appendChild(lbl);

    const b = await badge(row.badge, row.bg, row.tx);
    b.x = (contentW - 36) - b.width - 40;
    b.y = y + 6;
    card.appendChild(b);
  }

  card.appendChild(cardTitle);
  page.appendChild(card);

  return page;
}

// ══════════════════════════════════════════════════════════════════════════
// PAGE 2 — Admins (ผู้ดูแลระบบ)
// ══════════════════════════════════════════════════════════════════════════
async function buildAdminsPage(contentW, contentH) {
  const page = frame("Page — ผู้ดูแลระบบ", contentW, contentH);
  setFill(page, C.bg);

  const filterRow = await buildFilterRow(["ทั้งหมด", "ใช้งานอยู่", "ถูกระงับ"], contentW - 36);
  filterRow.x = 18; filterRow.y = 18;
  page.appendChild(filterRow);

  // Table card
  const tableW = contentW - 36;
  const card = frame("AdminsTable", tableW, 340);
  setFill(card, C.card);
  setStroke(card, C.bdr);
  setBorderRadius(card, 10);
  card.x = 18; card.y = 65;
  card.clipsContent = true;

  const colWidths = [
    Math.round(tableW * 0.28),
    Math.round(tableW * 0.15),
    Math.round(tableW * 0.15),
    Math.round(tableW * 0.28),
    Math.round(tableW * 0.14),
  ];

  const headerRow = await buildTableRow(
    ["ผู้ใช้งาน", "สิทธิ์", "สถานะ", "คำขอล่าสุด", "จัดการ"],
    colWidths, 0, true
  );
  headerRow.x = 0; headerRow.y = 0;
  card.appendChild(headerRow);

  const adminData = [
    { name: "Jirayu Yoodee",  email: "jirayu@mana.co",  role: "ผู้ดูแล",      roleBg: C.bBg, roleTx: C.bTx, st: "แบบร่าง",    stBg: C.grayBg, stTx: C.ink3,  last: "ยังไม่ส่งคำขอ" },
    { name: "Dao Kaew",        email: "dao@mana.co",     role: "ผู้อนุมัติ",   roleBg: C.gBg, roleTx: C.gTx, st: "รออนุมัติ",  stBg: C.aBg,    stTx: C.aTx,   last: "ส่งไป Mana App แล้ว" },
    { name: "Somsoke Meboon",  email: "somsoke@mana.co", role: "ผู้ดูแล",      roleBg: C.bBg, roleTx: C.bTx, st: "ใช้งานอยู่", stBg: C.gBg,    stTx: C.gTx,   last: "อนุมัติแล้ว" },
    { name: "Ek Warin",        email: "ek@mana.co",      role: "ผู้ดูแล",      roleBg: C.bBg, roleTx: C.bTx, st: "ถูกระงับ",   stBg: C.rBg,    stTx: C.rTx,   last: "อนุมัติแล้ว" },
    { name: "Tong Tadthai",    email: "tong@mana.co",    role: "ผู้ดูแลสูงสุด",roleBg: C.pBg, roleTx: C.pTx, st: "ใช้งานอยู่", stBg: C.gBg,    stTx: C.gTx,   last: "อนุมัติแล้ว" },
  ];

  for (let i = 0; i < adminData.length; i++) {
    const d = adminData[i];
    const rowY = 34 + i * 52;
    const rowH = 52;

    const row = frame(`row-${i}`, tableW, rowH);
    setFill(row, C.card);
    row.x = 0; row.y = rowY;

    if (i < adminData.length - 1) {
      const div = rect("div", tableW, 1, C.bdr2);
      div.x = 0; div.y = rowH - 1;
      row.appendChild(div);
    }

    // Avatar
    const av = frame(`av-${i}`, 28, 28);
    setFill(av, C.bBg);
    setBorderRadius(av, 14);
    av.x = 14; av.y = 12;
    const avT = await text(d.name.split(" ").map(w => w[0]).join("").slice(0,2), 10, C.bTx, "SemiBold");
    avT.x = 6; avT.y = 8;
    av.appendChild(avT);
    row.appendChild(av);

    // Name + email
    const nameT = await text(d.name, 12.5, C.ink, "Medium");
    nameT.x = 50; nameT.y = 10;
    const emailT = await text(d.email, 11, C.ink3, "Regular");
    emailT.x = 50; emailT.y = 26;
    row.appendChild(nameT);
    row.appendChild(emailT);

    // Role badge
    const roleBadge = await badge(d.role, d.roleBg, d.roleTx);
    roleBadge.x = colWidths[0] + 14;
    roleBadge.y = 16;
    row.appendChild(roleBadge);

    // Status badge
    const stBadge = await badge(d.st, d.stBg, d.stTx);
    stBadge.x = colWidths[0] + colWidths[1] + 14;
    stBadge.y = 16;
    row.appendChild(stBadge);

    // Last request
    const lastT = await text(d.last, 12, C.ink3, "Regular");
    lastT.x = colWidths[0] + colWidths[1] + colWidths[2] + 14;
    lastT.y = 18;
    row.appendChild(lastT);

    // Manage button
    const btn = frame(`btn-manage-${i}`, 56, 28);
    setFill(btn, C.card);
    setStroke(btn, C.bdr);
    setBorderRadius(btn, 7);
    btn.x = colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + 14;
    btn.y = 12;
    const btnT = await text("จัดการ", 11.5, C.ink2, "Regular");
    btnT.x = 10; btnT.y = 7;
    btn.appendChild(btnT);
    row.appendChild(btn);

    card.appendChild(row);
  }

  page.appendChild(card);
  return page;
}

// ══════════════════════════════════════════════════════════════════════════
// PAGE 3 — Requests (คำขอที่ส่งแล้ว)
// ══════════════════════════════════════════════════════════════════════════
async function buildRequestsPage(contentW, contentH) {
  const page = frame("Page — คำขอที่ส่งแล้ว", contentW, contentH);
  setFill(page, C.bg);

  const filterRow = await buildFilterRow(
    ["ทั้งหมด", "รออนุมัติ", "อนุมัติแล้ว", "ถูกปฏิเสธ"],
    contentW - 36
  );
  filterRow.x = 18; filterRow.y = 18;
  page.appendChild(filterRow);

  // Info banner
  const banner = frame("InfoBanner", contentW - 36, 38);
  setFill(banner, C.navyLight);
  setStroke(banner, C.navyMid);
  setBorderRadius(banner, 8);
  banner.x = 18; banner.y = 65;

  const bannerT = await text("ℹ  หน้านี้ใช้ติดตามสถานะเท่านั้น — การอนุมัติ/ปฏิเสธทำใน Mana App", 12, C.navy, "Regular");
  bannerT.x = 12; bannerT.y = 11;
  banner.appendChild(bannerT);
  page.appendChild(banner);

  // Table
  const tableW = contentW - 36;
  const card = frame("RequestsTable", tableW, 270);
  setFill(card, C.card);
  setStroke(card, C.bdr);
  setBorderRadius(card, 10);
  card.x = 18; card.y = 117;
  card.clipsContent = true;

  const colW = [
    Math.round(tableW * 0.11),
    Math.round(tableW * 0.22),
    Math.round(tableW * 0.18),
    Math.round(tableW * 0.15),
    Math.round(tableW * 0.22),
    Math.round(tableW * 0.12),
  ];

  const headerRow = await buildTableRow(
    ["เลขที่", "รายการ", "ผู้ส่งคำขอ", "สถานะ", "ความคืบหน้า", "Actions"],
    colW, 0, true
  );
  headerRow.x = 0; headerRow.y = 0;
  card.appendChild(headerRow);

  const reqData = [
    { id: "REQ-0341", name: "แต่งตั้งผู้อนุมัติ",   by: "Somchai P.", stBg: C.aBg, stTx: C.aTx, st: "รออนุมัติ",  prog: 50,  done: "1/2", action: "ติดตาม" },
    { id: "REQ-0342", name: "จ่ายเงินเดือน",         by: "Priya R.",   stBg: C.aBg, stTx: C.aTx, st: "รออนุมัติ",  prog: 0,   done: "0/1", action: "ติดตาม" },
    { id: "REQ-0340", name: "เพิ่มวงเงินจัดสรร",     by: "Napat W.",   stBg: C.gBg, stTx: C.gTx, st: "อนุมัติแล้ว",prog: 100, done: "2/2", action: "ดูผล"   },
    { id: "REQ-0339", name: "ลดวงเงินจัดสรร",        by: "Somchai P.", stBg: C.rBg, stTx: C.rTx, st: "ถูกปฏิเสธ",  prog: 0,   done: "0/2", action: "ดูเหตุผล" },
  ];

  for (let i = 0; i < reqData.length; i++) {
    const d = reqData[i];
    const rowY = 34 + i * 58;
    const rowH = 58;

    const row = frame(`req-row-${i}`, tableW, rowH);
    setFill(row, C.card);
    row.x = 0; row.y = rowY;

    if (i < reqData.length - 1) {
      const div = rect("div", tableW, 1, C.bdr2);
      div.x = 0; div.y = rowH - 1;
      row.appendChild(div);
    }

    // ID
    const idT = await text(d.id, 12, C.navy, "SemiBold");
    idT.x = 14; idT.y = 21;
    row.appendChild(idT);

    // Name
    const nameT = await text(d.name, 12, C.ink, "Regular");
    nameT.x = colW[0] + 14; nameT.y = 21;
    row.appendChild(nameT);

    // By
    const byT = await text(d.by, 12, C.ink, "Regular");
    byT.x = colW[0] + colW[1] + 14; byT.y = 21;
    row.appendChild(byT);

    // Status badge
    const stB = await badge(d.st, d.stBg, d.stTx);
    stB.x = colW[0] + colW[1] + colW[2] + 14;
    stB.y = 18;
    row.appendChild(stB);

    // Progress bar
    const progContainer = frame(`prog-${i}`, 80, 4);
    progContainer.fills = [{ type: "SOLID", color: C.bdr2 }];
    setBorderRadius(progContainer, 4);
    progContainer.x = colW[0] + colW[1] + colW[2] + colW[3] + 14;
    progContainer.y = 26;

    const progFill = rect("fill", Math.max(1, Math.round(80 * d.prog / 100)), 4,
      d.prog === 100 ? C.gTx : d.prog === 0 && d.st === "ถูกปฏิเสธ" ? C.rTx : C.navy);
    setBorderRadius(progFill, 4);
    progFill.x = 0; progFill.y = 0;
    progContainer.appendChild(progFill);
    row.appendChild(progContainer);

    const progLbl = await text(d.done, 11, C.ink3, "Regular");
    progLbl.x = colW[0] + colW[1] + colW[2] + colW[3] + 100;
    progLbl.y = 23;
    row.appendChild(progLbl);

    // Action button
    const btn = frame(`btn-${i}`, 70, 28);
    setFill(btn, C.card);
    setStroke(btn, C.bdr);
    setBorderRadius(btn, 7);
    btn.x = colW[0] + colW[1] + colW[2] + colW[3] + colW[4] + 14;
    btn.y = 15;
    const btnT = await text(d.action, 11.5, C.ink2, "Regular");
    btnT.x = 10; btnT.y = 7;
    btn.appendChild(btnT);
    row.appendChild(btn);

    card.appendChild(row);
  }

  page.appendChild(card);
  return page;
}

// ══════════════════════════════════════════════════════════════════════════
// PAGE 4 — Settings (ตั้งค่าการทำงาน)
// ══════════════════════════════════════════════════════════════════════════
async function buildSettingsPage(contentW, contentH) {
  const page = frame("Page — ตั้งค่าการทำงาน", contentW, contentH);
  setFill(page, C.bg);

  const listW = contentW - 340;
  const detailW = 340;

  // Left: operation list
  const opList = frame("OperationList", listW, contentH);
  setFill(opList, C.bg);
  opList.x = 0; opList.y = 0;

  const ops = [
    { cat: "ผู้ดูแลระบบ", items: [
      { name: "แต่งตั้งผู้ดูแลสูงสุด", code: "Admin.AssignSuperAdmin", from: "เจ้าของร้าน",         to: "เจ้าของร้าน + ผู้ดูแลสูงสุด", toBg: C.pBg, toTx: C.pTx },
      { name: "แต่งตั้งผู้อนุมัติ",     code: "Admin.AssignAdmin",       from: "เจ้าของร้าน / ผู้ดูแลสูงสุด", to: "เจ้าของร้าน + ผู้อนุมัติ 1 คน", toBg: C.navyLight, toTx: C.navy },
      { name: "แต่งตั้งผู้ดูแล",        code: "Admin.AssignOperator",    from: "ผู้อนุมัติ",             to: "ผู้อนุมัติ 1 คน",             toBg: C.navyLight, toTx: C.navy },
    ]},
    { cat: "พนักงาน", items: [
      { name: "จัดการพนักงาน", code: "Employee.Manage", from: "ผู้ดูแล", to: "ไม่ต้องอนุมัติ", toBg: C.gBg, toTx: C.gTx },
    ]},
    { cat: "เงินเดือน / Allocation", items: [
      { name: "จ่ายเงินเดือน",        code: "Payroll.Payout",      from: "ผู้ดูแล", to: "ผู้อนุมัติ 1 คน", toBg: C.aBg, toTx: C.aTx },
      { name: "เพิ่มวงเงินจัดสรร",    code: "Allocation.Increase", from: "ผู้ดูแล", to: "ผู้อนุมัติ 2 คน", toBg: C.rBg, toTx: C.rTx },
      { name: "ลดวงเงินจัดสรร",       code: "Allocation.Decrease", from: "ผู้ดูแล", to: "ผู้อนุมัติ 2 คน", toBg: C.rBg, toTx: C.rTx },
    ]},
  ];

  let yOff = 16;

  for (const section of ops) {
    // Category label
    const catLbl = await text(section.cat.toUpperCase(), 11, C.ink3, "SemiBold");
    catLbl.x = 16; catLbl.y = yOff;
    opList.appendChild(catLbl);

    const catLine = rect("cat-line", listW - 70, 1, C.bdr);
    catLine.x = 70; catLine.y = yOff + 8;
    opList.appendChild(catLine);

    yOff += 26;

    for (let i = 0; i < section.items.length; i++) {
      const item = section.items[i];
      const isFirst = i === 0 && section === ops[0];

      const card = frame(`op-${item.code}`, listW - 20, 76);
      setFill(card, isFirst ? { r: 0.973, g: 0.984, b: 0.992 } : C.card);
      setBorderRadius(card, 9);

      if (isFirst) {
        card.strokes = [{ type: "SOLID", color: C.navy }];
        card.strokeWeight = isFirst ? 1.5 : 1;
        card.strokeLeftWeight = isFirst ? 3 : 1;
      } else {
        setStroke(card, C.bdr);
      }

      card.x = 10; card.y = yOff;

      const nameT = await text(item.name, 13, C.ink, "Medium");
      nameT.x = 50; nameT.y = 12;
      card.appendChild(nameT);

      const codeT = await text(item.code, 10.5, C.ink3, "Regular");
      codeT.x = 50; codeT.y = 30;
      card.appendChild(codeT);

      // From badge
      const fromB = await badge(item.from, C.grayBg, C.ink3);
      fromB.x = 50; fromB.y = 48;
      card.appendChild(fromB);

      // Arrow
      const arrowT = await text("→", 11, C.ink4, "Regular");
      arrowT.x = 50 + (item.from.length * 7) + 30;
      arrowT.y = 50;
      card.appendChild(arrowT);

      // To badge
      const toB = await badge(item.to, item.toBg, item.toTx);
      toB.x = 50 + (item.from.length * 7) + 48;
      toB.y = 48;
      card.appendChild(toB);

      // Toggle circle (simplified)
      const toggleBg = frame(`toggle-${i}`, 34, 20);
      setFill(toggleBg, C.navy);
      setBorderRadius(toggleBg, 20);
      toggleBg.x = listW - 54; toggleBg.y = 28;

      const toggleKnob = rect("knob", 14, 14, C.white);
      setBorderRadius(toggleKnob, 7);
      toggleKnob.x = 17; toggleKnob.y = 3;
      toggleBg.appendChild(toggleKnob);
      card.appendChild(toggleBg);

      opList.appendChild(card);
      yOff += 84;
    }

    yOff += 8;
  }

  // Right: detail panel
  const detail = frame("DetailPanel", detailW, contentH);
  setFill(detail, C.card);
  detail.x = listW; detail.y = 0;

  const detBorder = rect("left-border", 1, contentH, C.bdr);
  detBorder.x = 0; detBorder.y = 0;
  detail.appendChild(detBorder);

  // Empty state
  const emptyT = await text("เลือก operation\nเพื่อดูและแก้ไข", 12.5, C.ink4, "Regular");
  emptyT.x = (detailW - 100) / 2;
  emptyT.y = contentH / 2 - 20;
  emptyT.textAlignHorizontal = "CENTER";
  detail.appendChild(emptyT);

  page.appendChild(opList);
  page.appendChild(detail);

  return page;
}

// ══════════════════════════════════════════════════════════════════════════
// DRAWER — เพิ่มผู้ดูแล
// ══════════════════════════════════════════════════════════════════════════
async function buildAddAdminDrawer() {
  const drawerW = 360;
  const drawerH = 540;
  const drawer = frame("Drawer — เพิ่มผู้ดูแล", drawerW, drawerH);
  setFill(drawer, C.card);
  setStroke(drawer, C.bdr);
  setBorderRadius(drawer, 8);

  // Top stripe
  const stripe = rect("stripe", drawerW, 3, C.navy);
  stripe.x = 0; stripe.y = 0;
  drawer.appendChild(stripe);

  // Header
  const headerDiv = rect("header-div", drawerW, 1, C.bdr);
  headerDiv.x = 0; headerDiv.y = 56;
  drawer.appendChild(headerDiv);

  const title = await text("เพิ่มผู้ดูแลระบบ", 14, C.ink, "SemiBold");
  title.x = 16; title.y = 20;
  drawer.appendChild(title);

  const sub = await text("สร้างคำขอแต่งตั้ง → ส่งไป Mana App", 11.5, C.ink3, "Regular");
  sub.x = 16; sub.y = 38;
  drawer.appendChild(sub);

  // Fields
  let yOff = 72;

  async function fieldLabel(lbl, y) {
    const t = await text(lbl, 11, C.ink3, "SemiBold");
    t.x = 16; t.y = y;
    return t;
  }

  async function inputField(placeholder, y) {
    const input = frame(`input-${y}`, drawerW - 32, 36);
    setFill(input, C.bg);
    setStroke(input, C.bdr);
    setBorderRadius(input, 7);
    input.x = 16; input.y = y;

    const ph = await text(placeholder, 12.5, C.ink4, "Regular");
    ph.x = 11; ph.y = 10;
    input.appendChild(ph);
    return input;
  }

  const lbl1 = await fieldLabel("ผู้ใช้งาน", yOff);
  drawer.appendChild(lbl1);
  const inp1 = await inputField("ค้นหาชื่อ / อีเมล...", yOff + 18);
  drawer.appendChild(inp1);
  yOff += 70;

  const lbl2 = await fieldLabel("สิทธิ์ที่ต้องการแต่งตั้ง", yOff);
  drawer.appendChild(lbl2);
  yOff += 18;

  const roleOptions = ["ผู้ดูแล (Operator)", "ผู้อนุมัติ (Admin)", "ผู้ดูแลสูงสุด (SuperAdmin)"];
  for (let i = 0; i < roleOptions.length; i++) {
    const isSelected = i === 1;
    const opt = frame(`role-opt-${i}`, drawerW - 32, 36);
    setFill(opt, isSelected ? C.navy : C.card);
    setStroke(opt, isSelected ? C.navy : C.bdr);
    setBorderRadius(opt, 7);
    opt.x = 16; opt.y = yOff;

    const dot = frame(`dot-${i}`, 8, 8);
    dot.fills = [];
    dot.strokes = [{ type: "SOLID", color: isSelected ? C.white : C.bdr }];
    dot.strokeWeight = 1.5;
    setBorderRadius(dot, 4);
    dot.x = 11; dot.y = 14;
    opt.appendChild(dot);

    const optT = await text(roleOptions[i], 12.5, isSelected ? C.white : C.ink2, "Regular");
    optT.x = 28; optT.y = 10;
    opt.appendChild(optT);

    drawer.appendChild(opt);
    yOff += 42;
  }

  yOff += 4;
  const lbl3 = await fieldLabel("เหตุผล", yOff);
  drawer.appendChild(lbl3);
  const ta = frame("textarea", drawerW - 32, 70);
  setFill(ta, C.bg);
  setStroke(ta, C.bdr);
  setBorderRadius(ta, 7);
  ta.x = 16; ta.y = yOff + 18;

  const taPh = await text("ระบุเหตุผล...", 12.5, C.ink4, "Regular");
  taPh.x = 11; taPh.y = 10;
  ta.appendChild(taPh);
  drawer.appendChild(ta);

  yOff += 100;

  // Rule box
  const ruleBox = frame("rule-box", drawerW - 32, 60);
  setFill(ruleBox, C.navyLight);
  setStroke(ruleBox, C.navyMid);
  setBorderRadius(ruleBox, 8);
  ruleBox.x = 16; ruleBox.y = yOff;

  const ruleLbl = await text("Admin.AssignAdmin", 11, C.navy, "Medium");
  ruleLbl.x = 12; ruleLbl.y = 10;
  ruleBox.appendChild(ruleLbl);

  const ruleVal = await text("เจ้าของร้าน + ผู้อนุมัติ 1 คน", 13, C.navy, "SemiBold");
  ruleVal.x = 12; ruleVal.y = 28;
  ruleBox.appendChild(ruleVal);

  drawer.appendChild(ruleBox);
  yOff += 68;

  // Footer
  const footer = frame("footer", drawerW, 52);
  setFill(footer, C.bg);
  footer.x = 0; footer.y = drawerH - 52;

  const ftDiv = rect("footer-div", drawerW, 1, C.bdr);
  ftDiv.x = 0; ftDiv.y = 0;
  footer.appendChild(ftDiv);

  const sendBtn = frame("btn-send", 180, 30);
  setFill(sendBtn, C.navy);
  setBorderRadius(sendBtn, 7);
  sendBtn.x = 16; sendBtn.y = 11;

  const sendT = await text("ส่งคำขอไป Mana App", 12.5, C.white, "Regular");
  sendT.x = 16; sendT.y = 7;
  sendBtn.appendChild(sendT);
  footer.appendChild(sendBtn);

  const cancelBtn = frame("btn-cancel", 72, 30);
  setFill(cancelBtn, C.card);
  setStroke(cancelBtn, C.bdr);
  setBorderRadius(cancelBtn, 7);
  cancelBtn.x = 204; cancelBtn.y = 11;

  const cancelT = await text("ยกเลิก", 12.5, C.ink2, "Regular");
  cancelT.x = 14; cancelT.y = 7;
  cancelBtn.appendChild(cancelT);
  footer.appendChild(cancelBtn);

  drawer.appendChild(footer);

  return drawer;
}

// ══════════════════════════════════════════════════════════════════════════
// MAIN — Assemble all screens
// ══════════════════════════════════════════════════════════════════════════
async function main() {
  const SCREEN_W = 1280;
  const SCREEN_H = 720;
  const SIDEBAR_W = 196;
  const TOPBAR_H = 50;
  const CONTENT_W = SCREEN_W - SIDEBAR_W;
  const CONTENT_H = SCREEN_H - TOPBAR_H;

  const pages = [
    { title: "ภาพรวม",              cta: false, ctaLabel: "",          buildFn: buildDashPage     },
    { title: "ผู้ดูแลระบบ",         cta: true,  ctaLabel: "เพิ่มผู้ดูแล", buildFn: buildAdminsPage   },
    { title: "คำขอที่ส่งแล้ว",      cta: false, ctaLabel: "",          buildFn: buildRequestsPage },
    { title: "ตั้งค่าการทำงาน",     cta: false, ctaLabel: "",          buildFn: buildSettingsPage },
  ];

  const screenNames = ["01 ภาพรวม", "02 ผู้ดูแลระบบ", "03 คำขอที่ส่งแล้ว", "04 ตั้งค่าการทำงาน"];

  for (let i = 0; i < pages.length; i++) {
    const pg = pages[i];
    const screen = frame(`Screen — ${screenNames[i]}`, SCREEN_W, SCREEN_H);
    setFill(screen, C.bg);
    screen.x = i * (SCREEN_W + 80);
    screen.y = 0;

    // Sidebar
    const sidebar = await buildSidebar(SCREEN_H);
    sidebar.x = 0; sidebar.y = 0;
    screen.appendChild(sidebar);

    // Topbar
    const topbar = await buildTopbar(CONTENT_W, pg.title, pg.cta, pg.ctaLabel);
    topbar.x = SIDEBAR_W; topbar.y = 0;
    screen.appendChild(topbar);

    // Content
    const content = await pg.buildFn(CONTENT_W, CONTENT_H);
    content.x = SIDEBAR_W; content.y = TOPBAR_H;
    screen.appendChild(content);

    figma.currentPage.appendChild(screen);
  }

  // Drawer screen (separate)
  const drawerScreen = frame("Screen — 02 ผู้ดูแลระบบ + Drawer", SCREEN_W, SCREEN_H);
  setFill(drawerScreen, C.bg);
  drawerScreen.x = pages.length * (SCREEN_W + 80);
  drawerScreen.y = 0;

  const sidebar5 = await buildSidebar(SCREEN_H);
  sidebar5.x = 0; sidebar5.y = 0;
  drawerScreen.appendChild(sidebar5);

  const topbar5 = await buildTopbar(CONTENT_W, "ผู้ดูแลระบบ", true, "เพิ่มผู้ดูแล");
  topbar5.x = SIDEBAR_W; topbar5.y = 0;
  drawerScreen.appendChild(topbar5);

  const content5 = await buildAdminsPage(CONTENT_W, CONTENT_H);
  content5.x = SIDEBAR_W; content5.y = TOPBAR_H;
  drawerScreen.appendChild(content5);

  // Overlay
  const ov = rect("overlay", CONTENT_W, CONTENT_H, C.ink);
  ov.opacity = 0.1;
  ov.x = SIDEBAR_W; ov.y = TOPBAR_H;
  drawerScreen.appendChild(ov);

  // Drawer
  const drawer = await buildAddAdminDrawer();
  drawer.x = SIDEBAR_W + CONTENT_W - 360;
  drawer.y = TOPBAR_H;
  drawerScreen.appendChild(drawer);

  figma.currentPage.appendChild(drawerScreen);

  figma.viewport.scrollAndZoomIntoView(figma.currentPage.children);
  figma.closePlugin("✅ Mana BackOffice — สร้าง 5 screens เสร็จแล้ว!");
}

main().catch(err => figma.closePlugin("❌ Error: " + err.message));
