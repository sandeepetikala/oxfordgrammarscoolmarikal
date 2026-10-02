// Generates the Academic Calendar PDF -> public/academic-calendar-2026-27.pdf
// Source: "ACADEMIC CALENDAR 2026.docx" supplied by the school.
import PDFDocument from "pdfkit";
import fs from "fs";

const NAVY = "#0a1f3c", NAVY2 = "#12325c", GOLD = "#e2a018", CREAM = "#fff4e2";
const ALT = "#faf7f0", LINE = "#dcdcdc", MUTE = "#666666", TEXT = "#333333";
const left = 50, right = 545, W = right - left, BOTTOM = 770;

const doc = new PDFDocument({ size: "A4", margin: 50, bufferPages: true });
doc.pipe(fs.createWriteStream("public/academic-calendar-2026-27.pdf"));

// ---- Header ----
try { doc.image("public/logo.png", left, 42, { width: 62, height: 62 }); } catch { /* no logo */ }
doc.fillColor(NAVY).font("Helvetica-Bold").fontSize(21).text("Oxford Grammar School", left + 74, 46);
doc.fillColor(GOLD).font("Helvetica-Bold").fontSize(9.5).text("MARIKAL, NARAYANPET  ·  TELANGANA", left + 74, 73);
doc.fillColor(MUTE).font("Helvetica").fontSize(9).text("Marikal (Vill & Man), Narayanpet Dist., Telangana – 509351", left + 74, 88);

let y = 124;
doc.rect(left, y, W, 30).fill(NAVY);
doc.fillColor("#ffffff").font("Helvetica-Bold").fontSize(14).text("ACADEMIC CALENDAR   ·   2026 – 27", left, y + 8, { width: W, align: "center" });
y += 44;

function ensure(h) { if (y + h > BOTTOM) { doc.addPage(); y = 50; } }
function heading(t) {
  ensure(40);
  doc.fillColor(NAVY).font("Helvetica-Bold").fontSize(12).text(t, left, y);
  y += 18;
}

// ---- Annual schedule ----
heading("Annual Schedule");
const sched = [
  ["Date of reopening", "12.06.2026"],
  ["Last working day", "23.04.2027"],
  ["Summer Vacation", "24.04.2027 to 13.06.2027"],
];
table([{ t: "Item", w: 0.45 }, { t: "Date", w: 0.55 }], sched);
y += 6;
const notes = [
  "Syllabus for classes I to VIII shall be completed by 28.02.2027. The revision and remedial teaching and preparation for Annual Examinations will be during the month of March, 2027.",
  "Sports/Games shall be conducted every alternative day.",
  "Yoga and Meditation are to be conducted daily after assembly in the class room.",
];
doc.font("Helvetica").fontSize(9.5).fillColor("#444");
for (const n of notes) { const h = doc.heightOfString("•  " + n, { width: W }); ensure(h + 4); doc.fillColor("#444").font("Helvetica").fontSize(9.5).text("•  " + n, left, y, { width: W }); y += h + 4; }
y += 12;

// ---- Examination schedule ----
heading("Examination Schedule");
table([{ t: "Type of Assessment", w: 0.5 }, { t: "Schedule", w: 0.5 }], [
  ["Periodic Test-1", "By 31.07.2026"],
  ["Periodic Test-2", "By 21.09.2026"],
  ["Summative Assessment-1", "01.10.2026 to 09.10.2026"],
  ["Periodic Test-3", "By 10.12.2026"],
  ["Periodic Test-4", "By 15.02.2027"],
  ["Summative Assessment-2", "24.03.2027 to 31.03.2027"],
]);
y += 18;

// ---- Holidays ----
heading("Short Term Holidays");
table([{ t: "Holidays", w: 0.5 }, { t: "Dates", w: 0.5 }], [
  ["Dussehra Vacation", "10.10.2026 to 22.10.2026 (13 days)"],
  ["Pongal Vacation", "13.01.2027 to 17.01.2027 (5 days)"],
]);
y += 18;

// ---- Month-wise ----
doc.addPage(); y = 50;
heading("Month-wise Working Days and Activities");
table(
  [{ t: "Month", w: 0.14 }, { t: "From", w: 0.13 }, { t: "To", w: 0.13 }, { t: "Days", w: 0.11, align: "center" }, { t: "Activities Schedule", w: 0.49 }],
  [
    ["June 2026", "12.06.2026", "30.06.2026", "14", "School reopen: 12.06.2026"],
    ["July 2026", "01.07.2026", "31.07.2026", "26", "Class I to VIII: Teaching of current syllabus\nPT-1: 4 working days\nStudents performance shall be recorded in the Registers and cumulative records by 31.07.2026"],
    ["August 2026", "01.08.2026", "31.08.2026", "22", "Conduct of school level competitions – Games, sports, Essay/Elocution etc. on the evening of Independence Day 15th August, 2026."],
    ["September 2026", "01.09.2026", "30.09.2026", "23", "PT-2: 4 working days\nStudents performance shall be recorded in the Registers and cumulative records by 25.09.2026"],
    ["October 2026", "01.10.2026", "31.10.2026", "15", "SA-1: 01.10.2026 to 09.10.2026\nDussehra vacation / First Term Holidays: 10.10.2026 to 22.10.2026 (13 Days)\nDistribution of answer scripts to students and declaration of SA-1 results by 23.10.2026"],
    ["November 2026", "01.11.2026", "30.11.2026", "23", "Teaching of regular syllabus"],
    ["December 2026", "01.12.2026", "31.12.2026", "24", "PT-3: 4 working days\nStudents performance shall be recorded in the Registers and cumulative records by 15.12.2026"],
    ["January 2027", "01.01.2027", "31.01.2027", "20", "Sankranti Vacation / Second Term Holidays: 13.01.2027 to 17.01.2027 (5 days)"],
    ["February 2027", "01.02.2027", "28.02.2027", "23", "PT-4: 4 working days\nStudents performance shall be recorded in the Registers and cumulative records by 17.02.2027."],
    ["March 2027", "01.03.2027", "31.03.2027", "21", "Revision & remedial teaching for classes I to VIII and preparation for final exams."],
    ["April 2027", "01.04.2027", "30.04.2027", "16", "SA-2: 09.04.2027 to 19.04.2027\nRecording results in Cumulative Records: 22.04.2027\nDeclaration of Results: 23.04.2027\nLast working day for the academic year 2026-27: 23.04.2027\nSummer vacation: 24.04.2027 to 13.06.2027 (including 12th & 13th as Second Saturday and Sunday holidays)"],
  ],
  { firstBold: true },
);

// ---- Footer on every page ----
const range = doc.bufferedPageRange();
for (let i = range.start; i < range.start + range.count; i++) {
  doc.switchToPage(i);
  doc.page.margins.bottom = 0;
  doc.strokeColor(LINE).lineWidth(0.6).moveTo(left, 782).lineTo(right, 782).stroke();
  doc.fillColor(MUTE).font("Helvetica").fontSize(8)
    .text("Oxford Grammar School, Marikal  ·  Academic Calendar 2026-27", left, 788, { width: W, align: "center", lineBreak: false });
}
doc.end();
console.log("✓ Generated public/academic-calendar-2026-27.pdf");

// ---- table helper ----
function table(cols, rows, { firstBold = false } = {}) {
  const xs = []; let x = left;
  for (const c of cols) { xs.push(x); x += c.w * W; }
  const pad = 7, size = 9;
  const drawHead = () => {
    const hh = 22;
    doc.rect(left, y, W, hh).fill(NAVY2);
    cols.forEach((c, i) => doc.fillColor("#fff").font("Helvetica-Bold").fontSize(9)
      .text(c.t, xs[i] + pad, y + 7, { width: c.w * W - pad * 2, align: c.align || "left" }));
    y += hh;
  };
  ensure(60); drawHead();
  let alt = false;
  for (const r of rows) {
    const hs = r.map((v, i) => { doc.font(i === 0 && firstBold ? "Helvetica-Bold" : "Helvetica").fontSize(size); return doc.heightOfString(v, { width: cols[i].w * W - pad * 2 }); });
    const h = Math.max(...hs) + pad * 2;
    if (y + h > BOTTOM) { doc.addPage(); y = 50; drawHead(); alt = false; }
    if (alt) doc.rect(left, y, W, h).fill(ALT);
    r.forEach((v, i) => doc.fillColor(i === 0 ? NAVY : TEXT).font(i === 0 && (firstBold || cols.length === 2) ? "Helvetica-Bold" : "Helvetica").fontSize(size)
      .text(v, xs[i] + pad, y + pad, { width: cols[i].w * W - pad * 2, align: cols[i].align || "left" }));
    doc.strokeColor(LINE).lineWidth(0.6);
    doc.moveTo(left, y + h).lineTo(right, y + h).stroke();
    [...xs, right].forEach((xx) => doc.moveTo(xx, y).lineTo(xx, y + h).stroke());
    y += h; alt = !alt;
  }
}
