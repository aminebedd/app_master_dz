// Settings for the shared demo-store engine (../_shop/shop.js).
// The store's own "details" panel stays; its fake order form becomes a button into the real order flow.
window.SHOP = {
  currency: "DA",
  theme: { bg: "#0B1430", surface: "#111D40", text: "#F4F7FF", muted: "#93A1BD", accent: "#2F6BFF", onAccent: "#FFFFFF", line: "rgba(255,255,255,.14)", radius: "22px" },
  prepare: () => {
    const f = document.querySelector("#detail .form");
    if (f) f.innerHTML = '<h4>اطلب هذا اللابتوب</h4><button type="button" class="btn btn-p" data-ds-detail style="width:100%">اطلب الآن</button><div class="note">نعيطولك باش نأكدو قبل ما نبعثو · الدفع عند الاستلام</div>';
  },
  products: [{ card: "#grid .pc", name: "h3", price: ".price", trigger: ".btn-p", ignore: ".btn-g", clickCard: false }],
  filters: [{ buttons: ".chips button", map: { "Core i5": "i5", "16 Go RAM": "16 Go" }, scope: "#grid .pc" }],
  links: [
    {
      sel: "[data-ds-detail]",
      run: (el, a) =>
        a.openProduct({
          name: a.text(a.$("#d-mk")) + " " + a.text(a.$("#d-name")),
          price: a.priceOf(a.$("#d-price")),
          img: a.$("#d-img").src,
          sizes: [],
          colors: [],
        }),
    },
  ],
  sections: { products: "#pcs", contact: "#contact" },
  css: "@media (max-width:760px){.ds-fcart{bottom:86px}}",
  instagram: "belbal_informatique",
  maps: "Belbal Informatique",
};
