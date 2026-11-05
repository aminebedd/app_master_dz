// Settings for the shared demo-store engine (../_shop/shop.js).
// Marlei sells by link: the order section takes a product link from SHEIN / ZARA… and the price is sent later.
window.SHOP = {
  theme: { bg: "#FAF7F2", surface: "#FFFFFF", text: "#1A1A1A", muted: "#8A8178", accent: "#1A1A1A", onAccent: "#FFFFFF", line: "rgba(26,26,26,0.12)", radius: "20px" },
  products: [{ card: ".prod", name: "h3", price: ".price", sizes: ".sizes span", trigger: ".add" }],
  cart: { button: ".cart", pseudo: ".cart" },
  menu: { burger: ".burger", links: "header nav a" },
  inline: [{ container: "#order form", mode: "link" }],
  sections: { products: "#shop", contact: ".visit" },
  catMap: { "موضة": "جين|تريكو|تيشورت|Kiabi", "صاكات": "صاك", "صبابط": "بوت", "تريكو": "تريكو", "كوسميتيك": "كوسميتيك" },
  links: [{ sel: ".visit .btn", run: (el, a) => a.ig() }],
  instagram: "marlei_shop__",
  maps: "Marlei Shop",
};
