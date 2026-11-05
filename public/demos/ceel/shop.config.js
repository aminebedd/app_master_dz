// Settings for the shared demo-store engine (../_shop/shop.js).
window.SHOP = {
  lang: "fr",
  currency: "DA",
  theme: { bg: "#FFFFFF", surface: "#F4F2EF", text: "#141414", muted: "#77716B", accent: "#FF6B1A", onAccent: "#FFFFFF", line: "#E9E4DE", radius: "18px" },
  products: [
    // "+" adds straight to the cart; clicking the rest of the card shows the product.
    { card: ".deals .card", name: "h4", price: ".pr", trigger: ".add", direct: true },
    { card: ".small .mini", name: "b", price: "span" },
  ],
  cart: { button: ".cart", count: ".cart em" },
  inline: [{ container: "#order .form" }],
  search: { box: ".search", replace: "span", button: "i" },
  timer: ".timer b",
  soon: ".acts .hide",
  optionSel: ".cats a",
  sections: { products: "#deals" },
  catMap: {
    "tout": "",
    "réfrigérateurs": "Réfrigérateur|Froid",
    "climatiseurs": "Clim",
    "cuisinières": "Cuisson|Plaque|Micro",
    "machines à laver": "Lavage|laver",
    "machines à café": "café",
    "café": "café",
    "petit électroménager": "sel:.mini",
    "entretien": "Aspirateur",
  },
  instagram: "ceelstoree",
  maps: "CeeL Store Hesnaoua Tizi Ouzou",
};
