// Settings for the shared demo-store engine (../_shop/shop.js).
window.SHOP = {
  theme: { bg: "#FAF7F4", surface: "#FFFFFF", text: "#141414", muted: "#7A716B", accent: "#B3122E", onAccent: "#FFFFFF", line: "#ECE5DF", radius: "20px" },
  // Keep the order section's heading, replace its fake fields with a real form.
  prepare: () => {
    const f = document.querySelector("#order .f");
    if (!f) return;
    f.querySelectorAll(":scope > .sel, :scope > .fld, :scope > .f2, :scope > a.btn, :scope > .note").forEach((n) => n.remove());
    const box = document.createElement("div");
    box.className = "ds-hrform";
    f.appendChild(box);
  },
  products: [{ card: "#grid .card", name: "h3", price: ".pr", colors: ".cols i", sizes: ".sizes span", trigger: "[data-i]" }],
  inline: [{ container: "#order .ds-hrform" }],
  filters: [{ buttons: ".chips button", map: { "فساتين سهرة": "سهرة", "فساتين يومية": "!سهرة" }, scope: "#grid .card" }],
  sections: { products: "#shop", contact: "#contact" },
  css: [
    "@media (max-width:760px){.ds-fcart{bottom:86px}}",
    // Mobile overflow: the long Instagram handle can't wrap and grid items won't shrink below it,
    // which pushed the whole page to ~410px wide on a 375px phone.
    ".contact>*,.info div>div{min-width:0}",
    ".info b{overflow-wrap:anywhere}",
  ].join(""),
  instagram: "collection_red1_by_hr",
  maps: "Collection by HR",
};
