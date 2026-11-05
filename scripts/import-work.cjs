// Imports the real work into the site. Safe to re-run (overwrites its own output).
//
//   node scripts/import-work.cjs
//
// 1. D:\videos\sites\<store>\  → public/demos/<store>/   (the runnable store: html, ig/, img/, fonts/, vid/)
// 2. store screenshots          → public/projects/<store>/*.webp  (resized, ~10× smaller than the PNGs)
// 3. D:\videos\out\*.mp4         → public/videos/
// 4. ExcellenceSchool screenshot → public/projects/excellence-school/
const fs = require("node:fs");
const path = require("node:path");
const sharp = require("sharp");

const SITES = "D:/videos/sites";
const OUT = "D:/videos/out";
const SCHOOL_IMG = path.join(process.env.USERPROFILE, "OneDrive/Documents/portfolio/image.jpg");
const PUB = path.join(__dirname, "..", "public");

// Not imported: phonehouse is empty (links file only), storpc is the Belbal store bundled into
// one file, and demo-laptop was removed from the site on request.
const stores = ["adora", "arwashoes", "aurenne", "belbal", "ceel", "chicdemira", "hr", "izi", "marlei", "mboutique", "walidcosmetique"];

// Working files that are not part of the live store.
const skip = (name) =>
  /\.png$/i.test(name) ||
  /^(\.git|get\.py|ids\.json|sheet\.jpg|mobile-frame\.html|index-v\d\.html|belbal-site\.html|README\.md)$/i.test(name);

function copyDir(src, dst) {
  fs.mkdirSync(dst, { recursive: true });
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    if (skip(e.name)) continue;
    const s = path.join(src, e.name);
    const d = path.join(dst, e.name);
    if (e.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

async function shot(src, dst, width) {
  await sharp(src).resize({ width, withoutEnlargement: true }).webp({ quality: 80 }).toFile(dst);
}

(async () => {
  const report = {};
  for (const s of stores) {
    copyDir(path.join(SITES, s), path.join(PUB, "demos", s));
    const pdir = path.join(PUB, "projects", s);
    fs.rmSync(pdir, { recursive: true, force: true });
    fs.mkdirSync(pdir, { recursive: true });
    const files = fs.readdirSync(path.join(SITES, s));
    const desktop = files.filter((f) => /^(desktop(-\d-[a-z]+)?|admin)\.png$/.test(f)).sort();
    // Phone screenshots: full-height frames only (skips the short leftovers at the end of a scroll).
    const mobile = [];
    for (const f of files.filter((f) => /^mobile-(\d+|intro-\d)\.png$/.test(f) || (s === "demo-laptop" && f === "chk.png")).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))) {
      const m = await sharp(path.join(SITES, s, f)).metadata();
      if (m.height / m.width >= 1.9) mobile.push(f);
    }
    for (const f of desktop) await shot(path.join(SITES, s, f), path.join(pdir, f.replace(/\.png$/, ".webp")), 1440);
    for (const f of mobile.slice(0, 4)) await shot(path.join(SITES, s, f), path.join(pdir, f.replace(/\.png$/, ".webp")), 780);
    report[s] = { desktop, mobile: mobile.slice(0, 4) };
  }

  const vdir = path.join(PUB, "videos");
  fs.mkdirSync(vdir, { recursive: true });
  const videos = {
    "showreel.mp4": "showreel.mp4",
    "abaya-clip.mp4": "abaya-clip.mp4",
    "canva-pro-voice-v2.mp4": "canva-pro.mp4",
    "claude-offer-v2.mp4": "claude-offer.mp4",
    "stream-offer.mp4": "stream-offer.mp4",
    "stream-pro-voice-v2.mp4": "stream-pro.mp4",
  };
  for (const [from, to] of Object.entries(videos)) fs.copyFileSync(path.join(OUT, from), path.join(vdir, to));

  const sdir = path.join(PUB, "projects", "excellence-school");
  fs.mkdirSync(sdir, { recursive: true });
  await shot(SCHOOL_IMG, path.join(sdir, "admin-dashboard.webp"), 1440);

  console.log(JSON.stringify(report, null, 1));
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
