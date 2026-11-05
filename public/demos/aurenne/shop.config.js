// Settings for the shared demo-store engine (../_shop/shop.js).
window.SHOP = {
  theme: { bg: "#F8F1EC", surface: "#FFFFFF", text: "#2B1A1C", muted: "#8C7472", accent: "#6B1628", onAccent: "#FFFFFF", line: "rgba(107,22,40,0.16)", radius: "18px" },
  products: [
    // "Piece of the week": colour and size are picked on the page, the button adds straight to the cart.
    { card: ".feature", name: "h3", price: ".price", sizes: ".sz span", colors: ".sw i", trigger: ".cta", direct: true },
    { card: "#shop .item", name: "h4", price: ".meta b", colors: ".dots i", sizeList: ["S", "M", "L", "XL"], trigger: ".quick" },
  ],
  cart: { button: ".bag", count: ".bag i" },
  menu: { burger: ".burger", links: "header nav a" },
  inline: [{ container: "#order .checkout" }],
  sections: { products: "#shop" },
  catMap: { "nouveautés": "", "فساتين": "فستان", "ترانش": "ترانش", "بليزر": "بليزر" },
  css: "#order .checkout.ds-inline{display:block;padding:32px;max-width:760px;margin-inline:auto}",
  instagram: "aurenne.boutique",
  maps: "Aurenne boutique",
};
