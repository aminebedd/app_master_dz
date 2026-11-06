// Settings for the shared demo-store engine (../_shop/shop.js).
window.SHOP = {
  theme: { bg: "#FBF7F0", surface: "#FFFFFF", text: "#1B1B1F", muted: "#7D725F", accent: "#14213D", onAccent: "#FFFFFF", line: "rgba(20,33,61,0.13)", radius: "16px" },
  products: [{ card: ".collection .q", name: "h3", price: ".pp", colors: ".cols i", sizeList: ["50", "52", "54", "56", "58", "60"], trigger: ".pp a" }],
  filters: [{ buttons: ".tabs span", scope: ".collection .q" }],
  menu: { burger: ".m", links: "header nav a" },
  sections: { products: "#shop" },
  links: [
    {
      // "Build your order" panel: colour, size and quantity are chosen on the page.
      sel: ".builder .gbtn",
      run: (el, a) => {
        const b = el.closest(".builder");
        const on = (s) => b.querySelector(s);
        a.addLine(
          { name: a.text(on(".cfg h3")), price: a.priceOf(on(".cfg .price")), img: on(".view > img").src },
          { size: a.text(on(".sizes span.on")), color: on(".swatch i.on") ? a.swatchOf(on(".swatch i.on")) : "", qty: +a.text(on(".qty b")) || 1 },
        );
        a.openCheckout();
      },
    },
  ],
  css: [
    // Mobile overflow: the filter tabs row and the order builder's grid items wouldn't shrink,
    // pushing the page wider than a 360px phone.
    ".builder>*,.fabric>*{min-width:0}",
    "@media (max-width:760px){",
    ".tabs{flex-wrap:wrap;row-gap:8px}",
    ".swatch{flex-wrap:wrap}",
    ".cfg .buy{grid-template-columns:1fr}",
    ".sizes{gap:6px}",
    "}",
  ].join(""),
  instagram: "m_boutique16",
  maps: "M Boutique",
};
