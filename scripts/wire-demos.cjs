// Adds the demo-store engine to every store in public/demos (safe to run repeatedly).
//
//   node scripts/wire-demos.cjs
//
// Each store needs a shop.config.js next to its index.html; the engine is public/demos/_shop/shop.js.
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");

const DEMOS = path.join(__dirname, "..", "public", "demos");
// ?v=<content hash> makes browsers fetch a fresh copy whenever a file changes.
const v = (file) => crypto.createHash("sha1").update(fs.readFileSync(file)).digest("hex").slice(0, 8);
const engineV = v(path.join(DEMOS, "_shop", "shop.js"));
const tag = (store) =>
  `<!-- app-master demo engine -->\n<script src="shop.config.js?v=${v(path.join(DEMOS, store, "shop.config.js"))}"></script>\n<script src="../_shop/shop.js?v=${engineV}"></script>\n`;

const done = [];
for (const store of fs.readdirSync(DEMOS)) {
  const html = path.join(DEMOS, store, "index.html");
  if (store.startsWith("_") || !fs.existsSync(html)) continue;
  if (!fs.existsSync(path.join(DEMOS, store, "shop.config.js"))) {
    console.warn(`skip ${store}: no shop.config.js`);
    continue;
  }
  let s = fs.readFileSync(html, "utf8");
  s = s.replace(/<!-- app-master demo engine -->\n[\s\S]*?shop\.js[^"]*"><\/script>\n/, "");
  s = s.replace(/<\/body>/i, `${tag(store)}</body>`);
  fs.writeFileSync(html, s);
  done.push(store);
}
console.log("wired:", done.join(", "));
