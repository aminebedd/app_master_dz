/*
 * App Master DZ — demo store engine.
 *
 * Turns a static store mock-up into a working demo: product details, cart,
 * order form (name, phone, wilaya, delivery) and an order confirmation.
 * Nothing is sent or stored on a server — orders exist only in the browser.
 *
 * Each store sets `window.SHOP = { ... }` (its products, cart icon, colours…)
 * before loading this file at the end of <body>.
 */
(() => {
  "use strict";
  const C = window.SHOP || {};
  const doc = document;
  const FR = (C.lang || doc.documentElement.lang) === "fr";

  // ------------------------------------------------------------------ strings
  const T = FR
    ? {
        add: "Ajouter au panier", buy: "Commander", qty: "Quantité", size: "Taille", color: "Couleur",
        cart: "Votre panier", empty: "Votre panier est vide.", browse: "Voir les produits", checkout: "Passer la commande",
        subtotal: "Sous-total", delivery: "Livraison", total: "Total", remove: "Retirer",
        name: "Nom complet", phone: "Téléphone", wilaya: "Wilaya", chooseWilaya: "Choisir la wilaya", commune: "Commune",
        address: "Adresse (facultatif)", note: "Remarque (facultatif)", product: "Produit", chooseProduct: "Choisir un produit",
        confirm: "Confirmer la commande", cod: "💵 Paiement à la livraison · on vous appelle pour confirmer",
        errName: "Entrez votre nom.", errPhone: "Numéro invalide (ex. 0555 12 34 56).", errWilaya: "Choisissez la wilaya.",
        errCommune: "Entrez la commune.", errProduct: "Choisissez un produit.", errLink: "Collez le lien du produit.",
        doneTitle: "Commande reçue ✓", doneBody: (p) => `Merci ! Nous vous appelons au ${p} pour confirmer la livraison.`,
        orderNo: "N° de commande", again: "Nouvelle commande", keep: "Continuer mes achats",
        demo: "Boutique de démonstration — aucune commande n'est réellement envoyée.",
        added: "Ajouté au panier ✓", soon: "Disponible dans la version finale de la boutique.",
        wa: "Le bouton WhatsApp ouvrira la discussion avec la boutique.", menu: "Menu", close: "Fermer",
        noMatch: "Aucun produit dans cette catégorie pour l'instant — voici tout le catalogue.",
        fav: "Ajouté aux favoris ♥", unfav: "Retiré des favoris", link: "Lien du produit", price: "Prix",
        priceLater: "On vous envoie le prix", search: "Rechercher un produit…", free: "Gratuit",
      }
    : {
        add: "أضف للسلة", buy: "اطلب الآن", qty: "الكمية", size: "المقاس", color: "اللون",
        cart: "السلة", empty: "السلة فارغة.", browse: "تصفّح المنتجات", checkout: "إتمام الطلب",
        subtotal: "المجموع الفرعي", delivery: "التوصيل", total: "المجموع", remove: "حذف",
        name: "الاسم واللقب", phone: "رقم الهاتف", wilaya: "الولاية", chooseWilaya: "اختر الولاية", commune: "البلدية",
        address: "العنوان (اختياري)", note: "ملاحظة (اختياري)", product: "المنتج", chooseProduct: "اختر المنتج",
        confirm: "تأكيد الطلبية", cod: "💵 الدفع عند الاستلام · نعيطولك باش نأكدو الطلبية",
        errName: "اكتب الاسم واللقب.", errPhone: "رقم غير صحيح (مثال: 0555 12 34 56).", errWilaya: "اختر الولاية.",
        errCommune: "اكتب البلدية.", errProduct: "اختر المنتج.", errLink: "حط رابط القطعة.",
        doneTitle: "وصلتنا طلبيتك ✓", doneBody: (p) => `شكراً! نعيطولك على ${p} باش نأكدو الطلبية والتوصيل.`,
        orderNo: "رقم الطلبية", again: "طلبية جديدة", keep: "مواصلة التسوّق",
        demo: "متجر تجريبي — الطلبية ما تتبعثش لحتى جهة.",
        added: "تزادت للسلة ✓", soon: "متوفرة في النسخة النهائية تاع المتجر.",
        wa: "زر الواتساب يفتح المحادثة مع المحل.", menu: "القائمة", close: "إغلاق",
        noMatch: "ما كاش موديلات في هذا القسم حالياً — هاهي كل الموديلات.",
        fav: "تزادت للمفضلة ♥", unfav: "تنحّات من المفضلة", link: "رابط القطعة", price: "السعر",
        priceLater: "نبعثولك السعر", search: "ابحث عن منتج…", free: "مجاني",
      };
  if (C.strings) Object.assign(T, C.strings);

  const CUR = C.currency || (FR ? "DA" : "دج");
  const DELIVERY = C.delivery || (FR
    ? [{ id: "home", label: "🚚 Livraison à domicile", fee: 600 }, { id: "shop", label: "🏬 Retrait au magasin", fee: 0 }]
    : [{ id: "home", label: "🏠 للدار", fee: 600 }, { id: "office", label: "🏢 للمكتب", fee: 400 }]);

  const WILAYAS = ["أدرار|Adrar", "الشلف|Chlef", "الأغواط|Laghouat", "أم البواقي|Oum El Bouaghi", "باتنة|Batna", "بجاية|Béjaïa", "بسكرة|Biskra", "بشار|Béchar", "البليدة|Blida", "البويرة|Bouira", "تمنراست|Tamanrasset", "تبسة|Tébessa", "تلمسان|Tlemcen", "تيارت|Tiaret", "تيزي وزو|Tizi Ouzou", "الجزائر|Alger", "الجلفة|Djelfa", "جيجل|Jijel", "سطيف|Sétif", "سعيدة|Saïda", "سكيكدة|Skikda", "سيدي بلعباس|Sidi Bel Abbès", "عنابة|Annaba", "قالمة|Guelma", "قسنطينة|Constantine", "المدية|Médéa", "مستغانم|Mostaganem", "المسيلة|M'Sila", "معسكر|Mascara", "ورقلة|Ouargla", "وهران|Oran", "البيض|El Bayadh", "إليزي|Illizi", "برج بوعريريج|Bordj Bou Arréridj", "بومرداس|Boumerdès", "الطارف|El Tarf", "تندوف|Tindouf", "تيسمسيلت|Tissemsilt", "الوادي|El Oued", "خنشلة|Khenchela", "سوق أهراس|Souk Ahras", "تيبازة|Tipaza", "ميلة|Mila", "عين الدفلى|Aïn Defla", "النعامة|Naâma", "عين تموشنت|Aïn Témouchent", "غرداية|Ghardaïa", "غليزان|Relizane", "تيميمون|Timimoun", "برج باجي مختار|Bordj Badji Mokhtar", "أولاد جلال|Ouled Djellal", "بني عباس|Béni Abbès", "عين صالح|In Salah", "عين قزام|In Guezzam", "تقرت|Touggourt", "جانت|Djanet", "المغير|El M'Ghair", "المنيعة|El Meniaa"]
    .map((w, i) => `${String(i + 1).padStart(2, "0")} - ${w.split("|")[FR ? 1 : 0]}`);

  // ------------------------------------------------------------------ helpers
  const $ = (s, r = doc) => r.querySelector(s);
  const $$ = (s, r = doc) => (s ? [...r.querySelectorAll(s)] : []);
  const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const fmt = (n) => `${Math.round(n).toLocaleString("fr-FR").replace(/[  ]/g, " ")} ${CUR}`;
  const text = (el) => (el ? el.textContent.replace(/\s+/g, " ").trim() : "");
  // Price of an element, ignoring struck-through old prices inside it.
  const priceOf = (el) => {
    if (!el) return 0;
    const c = el.cloneNode(true);
    c.querySelectorAll("s,del").forEach((s) => s.remove());
    const m = c.textContent.replace(/[\s  ]/g, "").match(/\d+(?:[.,]\d+)?/);
    return m ? Math.round(parseFloat(m[0].replace(",", "."))) : 0;
  };
  const oldPriceOf = (el) => priceOf(el && (el.querySelector("s,del") || null));
  const swatchOf = (el) => el.style.background || el.style.backgroundColor || getComputedStyle(el).backgroundColor;
  const storeKey = "ds-cart:" + location.pathname;

  // Store-specific DOM preparation (e.g. carving a container out of a fake form).
  if (typeof C.prepare === "function") C.prepare();

  // ------------------------------------------------------------------ theme + css
  const th = Object.assign(
    { bg: "#fff", surface: "#fff", text: "#141414", muted: "#77716B", accent: "#141414", onAccent: "#fff", line: "rgba(0,0,0,.12)", radius: "16px", error: "#C62828", success: "#1B873F" },
    C.theme || {},
  );
  const css = `
  :root{--ds-bg:${th.bg};--ds-s:${th.surface};--ds-t:${th.text};--ds-m:${th.muted};--ds-a:${th.accent};--ds-on:${th.onAccent};--ds-l:${th.line};--ds-r:${th.radius};--ds-err:${th.error};--ds-ok:${th.success}}
  html{scroll-behavior:smooth}
  .ds-ov{position:fixed;inset:0;z-index:9990;background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center;padding:16px;animation:ds-f .18s ease}
  .ds-modal{position:relative;background:var(--ds-bg);color:var(--ds-t);border:1px solid var(--ds-l);border-radius:var(--ds-r);width:min(860px,100%);max-height:calc(100dvh - 32px);overflow:auto;box-shadow:0 30px 80px rgba(0,0,0,.35);font-family:inherit;animation:ds-u .22s ease}
  .ds-modal.ds-narrow{width:min(520px,100%)}
  .ds-x{position:absolute;top:12px;inset-inline-end:12px;width:38px;height:38px;border-radius:50%;border:1px solid var(--ds-l);background:var(--ds-bg);color:var(--ds-t);font-size:20px;line-height:1;cursor:pointer;z-index:2}
  .ds-pm{display:grid;grid-template-columns:1fr 1fr}
  .ds-pm img{width:100%;height:100%;min-height:320px;max-height:560px;object-fit:cover;display:block;background:var(--ds-s)}
  .ds-pb{padding:28px;display:flex;flex-direction:column;gap:16px}
  .ds-pb h3{font-size:24px;line-height:1.3;margin:0;padding-inline-end:36px}
  .ds-price{font-size:24px;font-weight:800;color:var(--ds-a)} .ds-price s{color:var(--ds-m);font-size:15px;font-weight:400;margin-inline-start:8px}
  .ds-lab{font-size:13px;color:var(--ds-m);margin-bottom:8px;display:block}
  .ds-chips{display:flex;flex-wrap:wrap;gap:8px}
  .ds-chip{min-width:42px;padding:8px 12px;border-radius:10px;border:1px solid var(--ds-l);background:transparent;color:var(--ds-t);font:inherit;font-size:14px;cursor:pointer}
  .ds-chip[aria-pressed=true]{border-color:var(--ds-a);box-shadow:0 0 0 1px var(--ds-a) inset;font-weight:700}
  .ds-sw{width:34px;height:34px;min-width:0;padding:0;border-radius:50%;border:2px solid var(--ds-l)}
  .ds-sw[aria-pressed=true]{box-shadow:0 0 0 2px var(--ds-bg),0 0 0 4px var(--ds-a)}
  .ds-qty{display:inline-flex;align-items:center;border:1px solid var(--ds-l);border-radius:10px;overflow:hidden}
  .ds-qty button{width:38px;height:38px;border:0;background:transparent;color:var(--ds-t);font-size:18px;cursor:pointer}
  .ds-qty b{min-width:34px;text-align:center}
  .ds-row{display:flex;gap:10px;flex-wrap:wrap}
  .ds-btn{flex:1;min-width:140px;padding:14px 18px;border-radius:12px;font:inherit;font-weight:800;font-size:15px;cursor:pointer;border:1px solid var(--ds-a);text-align:center}
  .ds-btn-p{background:var(--ds-a);color:var(--ds-on)} .ds-btn-o{background:transparent;color:var(--ds-t)}
  .ds-btn:disabled{opacity:.6;cursor:wait}
  .ds-note{font-size:13px;color:var(--ds-m);margin:0}
  .ds-demo{font-size:12px;color:var(--ds-m);opacity:.85;margin:0}
  .ds-drawer{position:fixed;top:0;bottom:0;inset-inline-end:0;width:min(420px,100%);z-index:9991;background:var(--ds-bg);color:var(--ds-t);border-inline-start:1px solid var(--ds-l);display:flex;flex-direction:column;box-shadow:0 0 60px rgba(0,0,0,.3);animation:ds-s .22s ease;font-family:inherit}
  .ds-dh{display:flex;justify-content:space-between;align-items:center;padding:18px 20px;border-bottom:1px solid var(--ds-l)} .ds-dh b{font-size:18px}
  .ds-dh .ds-x{position:static}
  .ds-db{flex:1;overflow:auto;padding:8px 20px}
  .ds-df{padding:18px 20px;border-top:1px solid var(--ds-l);display:grid;gap:12px}
  .ds-line{display:grid;grid-template-columns:64px 1fr auto;gap:12px;align-items:center;padding:12px 0;border-bottom:1px solid var(--ds-l)}
  .ds-line img{width:64px;height:64px;object-fit:cover;border-radius:10px;background:var(--ds-s)}
  .ds-line small{display:block;color:var(--ds-m);font-size:12px;margin-top:2px}
  .ds-line .ds-rm{background:none;border:0;color:var(--ds-m);font:inherit;font-size:12px;cursor:pointer;text-decoration:underline;padding:0;margin-top:4px}
  .ds-dot{display:inline-block;width:11px;height:11px;border-radius:50%;border:1px solid var(--ds-l);vertical-align:middle}
  .ds-sum{display:flex;justify-content:space-between;font-size:14px;color:var(--ds-m)} .ds-sum.ds-tot{font-size:18px;color:var(--ds-t);font-weight:800} .ds-sum.ds-tot b{color:var(--ds-a)}
  .ds-emptyc{padding:40px 0;text-align:center;color:var(--ds-m);display:grid;gap:16px;justify-items:center}
  .ds-form{display:grid;gap:14px;color:var(--ds-t);font-family:inherit;text-align:start}
  .ds-form h3{margin:0;font-size:20px}
  .ds-f2{display:grid;grid-template-columns:1fr 1fr;gap:12px}
  .ds-fld{display:grid;gap:6px;min-width:0}
  .ds-fld label{font-size:13px;color:var(--ds-m)}
  .ds-in{width:100%;box-sizing:border-box;background:var(--ds-s);color:var(--ds-t);border:1px solid var(--ds-l);border-radius:12px;padding:13px 14px;font:inherit;font-size:16px;outline:none}
  .ds-in:focus{border-color:var(--ds-a);box-shadow:0 0 0 1px var(--ds-a)}
  .ds-in[aria-invalid=true]{border-color:var(--ds-err)}
  select.ds-in{appearance:auto}
  .ds-err{color:var(--ds-err);font-size:12px;min-height:0}
  .ds-pick{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:10px}
  .ds-pick label{display:flex;gap:8px;align-items:center;justify-content:center;border:1px solid var(--ds-l);border-radius:12px;padding:12px;cursor:pointer;font-size:14px;color:var(--ds-t);text-align:center}
  .ds-pick input{accent-color:var(--ds-a)}
  .ds-pick label:has(input:checked){border-color:var(--ds-a);box-shadow:0 0 0 1px var(--ds-a) inset;font-weight:700}
  .ds-mini{display:grid;gap:4px;border:1px solid var(--ds-l);border-radius:12px;padding:10px 14px;background:var(--ds-s)}
  .ds-mini .ds-line{grid-template-columns:44px 1fr auto;padding:8px 0;border-bottom:1px dashed var(--ds-l)} .ds-mini .ds-line:last-child{border-bottom:0}
  .ds-mini img{width:44px;height:44px}
  .ds-done{display:grid;gap:14px;justify-items:center;text-align:center;padding:10px 0}
  .ds-done .ds-ic{width:64px;height:64px;border-radius:50%;display:grid;place-items:center;background:var(--ds-ok);color:#fff;font-size:32px}
  .ds-done h3{margin:0;font-size:24px}
  .ds-done p{margin:0;color:var(--ds-m);line-height:1.8}
  .ds-no{font-family:ui-monospace,monospace;font-size:18px;font-weight:800;letter-spacing:1px;padding:8px 16px;border:1px dashed var(--ds-a);border-radius:10px;color:var(--ds-t)}
  .ds-inline{width:100%;box-sizing:border-box}
  .ds-toast{position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:9999;background:var(--ds-t);color:var(--ds-bg);padding:12px 20px;border-radius:12px;font-family:inherit;font-weight:700;font-size:14px;box-shadow:0 10px 30px rgba(0,0,0,.3);animation:ds-u .2s ease;max-width:calc(100% - 32px);text-align:center}
  .ds-fcart{position:fixed;bottom:22px;inset-inline-end:22px;z-index:9980;display:flex;align-items:center;gap:8px;padding:12px 18px;border-radius:40px;background:var(--ds-a);color:var(--ds-on);border:0;font:inherit;font-weight:800;cursor:pointer;box-shadow:0 10px 30px rgba(0,0,0,.3)}
  .ds-fcart[hidden]{display:none}
  .ds-badge{display:inline-grid;place-items:center;min-width:20px;height:20px;padding:0 5px;border-radius:10px;background:var(--ds-a);color:var(--ds-on);font-size:12px;font-weight:900;margin-inline-start:6px;vertical-align:middle}
  .ds-menu a{display:block;padding:16px 4px;border-bottom:1px solid var(--ds-l);font-size:18px;font-weight:700;color:var(--ds-t);text-decoration:none}
  .ds-hidden{display:none!important}
  .ds-search{flex:1;min-width:0;border:0;background:transparent;font:inherit;color:inherit;outline:none}
  @keyframes ds-f{from{opacity:0}} @keyframes ds-u{from{opacity:0;transform:translate(var(--tx,0),12px)}} @keyframes ds-s{from{transform:translateX(${doc.dir === "rtl" ? "-" : ""}100%)}}
  .ds-toast{--tx:-50%}
  @media (max-width:720px){.ds-pm{grid-template-columns:1fr}.ds-pm img{min-height:0;height:300px}.ds-f2{grid-template-columns:1fr}.ds-pb{padding:20px}.ds-ov{padding:0;align-items:flex-end}.ds-modal{max-height:94dvh;border-radius:var(--ds-r) var(--ds-r) 0 0}}
  ${C.css || ""}`;
  const st = doc.createElement("style");
  st.textContent = css;
  doc.head.appendChild(st);

  // ------------------------------------------------------------------ toast
  let toastT;
  const toast = (msg) => {
    $(".ds-toast")?.remove();
    const t = doc.createElement("div");
    t.className = "ds-toast";
    t.setAttribute("role", "status");
    t.textContent = msg;
    doc.body.appendChild(t);
    clearTimeout(toastT);
    toastT = setTimeout(() => t.remove(), 2600);
  };

  // ------------------------------------------------------------------ products
  const products = new Map(); // id -> product
  const groups = (C.products || []).map((g, gi) => ({ clickCard: true, ...g, gi }));
  const readCard = (card, g) => {
    const opts = (sel) => $$(sel, card);
    const sizeEls = g.sizes ? opts(g.sizes) : [];
    const colorEls = g.colors ? opts(g.colors) : [];
    const img = $(g.img || "img", card);
    return {
      name: text($(g.name, card)),
      price: priceOf($(g.price, card)),
      old: oldPriceOf($(g.price, card)) || priceOf(g.old && $(g.old, card)),
      img: img ? img.currentSrc || img.src : "",
      sizes: Array.isArray(g.sizeList) ? g.sizeList : sizeEls.filter((e) => !e.classList.contains("x")).map(text).filter(Boolean),
      colors: colorEls.map(swatchOf),
      sel: { size: text(sizeEls.find((e) => e.classList.contains("on"))), color: (colorEls.find((e) => e.classList.contains("on")) && swatchOf(colorEls.find((e) => e.classList.contains("on")))) || "" },
    };
  };
  const register = () => {
    groups.forEach((g) => {
      $$(g.card).forEach((card, i) => {
        if (card.dataset.dsId) return;
        const id = `p${g.gi}-${i}`;
        card.dataset.dsId = id;
        card.dataset.dsGroup = g.gi;
        if (g.clickCard) card.style.cursor = "pointer";
        products.set(id, { id, ...readCard(card, g) });
      });
    });
  };
  register();
  const allCards = () => groups.flatMap((g) => $$(g.card));

  // ------------------------------------------------------------------ cart state
  let cart = [];
  try { cart = JSON.parse(sessionStorage.getItem(storeKey) || "[]"); } catch { cart = []; }
  const save = () => { try { sessionStorage.setItem(storeKey, JSON.stringify(cart)); } catch {} renderCount(); };
  const count = () => cart.reduce((n, l) => n + l.qty, 0);
  const subtotal = (lines = cart) => lines.reduce((n, l) => n + l.price * l.qty, 0);
  const addLine = (p, opt = {}) => {
    const key = [p.name, opt.size || "", opt.color || "", opt.link || ""].join("|");
    const ex = cart.find((l) => l.key === key);
    if (ex) ex.qty += opt.qty || 1;
    else cart.push({ key, name: p.name, price: p.price, img: p.img, size: opt.size || "", color: opt.color || "", link: opt.link || "", qty: opt.qty || 1 });
    save();
  };

  // cart icon / badge
  const cartBtns = $$(C.cart && C.cart.button);
  if (C.cart && C.cart.pseudo) {
    st.textContent += `${C.cart.pseudo}::after{content:attr(data-ds-count)!important}${C.cart.pseudo}[data-ds-count="0"]::after{display:none!important}`;
  }
  let fcart = null;
  if (!cartBtns.length || C.floatCart) {
    fcart = doc.createElement("button");
    fcart.type = "button";
    fcart.className = "ds-fcart";
    fcart.hidden = true;
    fcart.innerHTML = `🛒 <span>${esc(T.cart)}</span><span class="ds-badge" data-ds-n>0</span>`;
    fcart.addEventListener("click", () => openCart());
    doc.body.appendChild(fcart);
  }
  function renderCount() {
    const n = count();
    if (C.cart && C.cart.count) $$(C.cart.count).forEach((el) => { el.textContent = n; el.style.visibility = n ? "" : "hidden"; });
    if (C.cart && C.cart.pseudo) $$(C.cart.pseudo).forEach((el) => el.setAttribute("data-ds-count", n));
    if (C.cart && C.cart.badge) cartBtns.forEach((b) => {
      let s = b.querySelector(".ds-badge");
      if (!s) { s = doc.createElement("span"); s.className = "ds-badge"; b.appendChild(s); }
      s.textContent = n; s.hidden = !n;
    });
    if (fcart) { fcart.hidden = !n; fcart.querySelector("[data-ds-n]").textContent = n; }
    $$("[data-ds-inline]").forEach((box) => box.__refresh && box.__refresh());
  }
  cartBtns.forEach((b) => { b.style.cursor = "pointer"; b.setAttribute("role", "button"); });

  // ------------------------------------------------------------------ overlays
  let lastFocus = null;
  const closeAll = () => {
    $$(".ds-ov,.ds-drawer,.ds-dbg").forEach((e) => e.remove());
    doc.body.style.overflow = "";
    lastFocus?.focus?.();
  };
  const overlay = (html, narrow) => {
    closeAll();
    lastFocus = doc.activeElement;
    const ov = doc.createElement("div");
    ov.className = "ds-ov";
    ov.innerHTML = `<div class="ds-modal${narrow ? " ds-narrow" : ""}" role="dialog" aria-modal="true"><button type="button" class="ds-x" aria-label="${esc(T.close)}">×</button>${html}</div>`;
    ov.addEventListener("click", (e) => { if (e.target === ov || e.target.closest(".ds-x")) closeAll(); });
    doc.body.appendChild(ov);
    doc.body.style.overflow = "hidden";
    setTimeout(() => ov.querySelector("button:not(.ds-x),input,select")?.focus(), 30);
    return ov.querySelector(".ds-modal");
  };
  doc.addEventListener("keydown", (e) => { if (e.key === "Escape") closeAll(); });

  // ------------------------------------------------------------------ product modal
  const chipsHTML = (kind, list, sel) =>
    list.length
      ? `<div><span class="ds-lab">${kind === "size" ? T.size : T.color}</span><div class="ds-chips" data-ds-opt="${kind}">${list
          .map((v, i) => {
            const on = sel ? v === sel : i === 0;
            return kind === "color"
              ? `<button type="button" class="ds-chip ds-sw" style="background:${esc(v)}" data-v="${esc(v)}" aria-pressed="${on}" aria-label="${esc(T.color)} ${i + 1}"></button>`
              : `<button type="button" class="ds-chip" data-v="${esc(v)}" aria-pressed="${on}">${esc(v)}</button>`;
          })
          .join("")}</div></div>`
      : "";
  function openProduct(p) {
    if (!p) return;
    const m = overlay(`
      <div class="ds-pm">
        <img src="${esc(p.img)}" alt="${esc(p.name)}">
        <div class="ds-pb">
          <h3>${esc(p.name)}</h3>
          <div class="ds-price">${fmt(p.price)}${p.old && p.old > p.price ? `<s>${fmt(p.old)}</s>` : ""}</div>
          ${chipsHTML("color", p.colors || [], p.sel && p.sel.color)}
          ${chipsHTML("size", p.sizes || [], p.sel && p.sel.size)}
          <div><span class="ds-lab">${T.qty}</span><div class="ds-qty"><button type="button" data-q="-1" aria-label="-">−</button><b data-ds-q>1</b><button type="button" data-q="1" aria-label="+">+</button></div></div>
          <div class="ds-row"><button type="button" class="ds-btn ds-btn-p" data-act="buy">${T.buy}</button><button type="button" class="ds-btn ds-btn-o" data-act="add">${T.add}</button></div>
          <p class="ds-note">${T.cod}</p>
        </div>
      </div>`);
    m.addEventListener("click", (e) => {
      const chip = e.target.closest("[data-ds-opt] .ds-chip");
      if (chip) chip.parentElement.querySelectorAll(".ds-chip").forEach((c) => c.setAttribute("aria-pressed", c === chip));
      const q = e.target.closest("[data-q]");
      if (q) { const b = m.querySelector("[data-ds-q]"); b.textContent = Math.max(1, Math.min(20, +b.textContent + +q.dataset.q)); }
      const act = e.target.closest("[data-act]");
      if (act) {
        const pick = (k) => m.querySelector(`[data-ds-opt="${k}"] [aria-pressed=true]`)?.dataset.v || "";
        addLine(p, { size: pick("size"), color: pick("color"), qty: +m.querySelector("[data-ds-q]").textContent });
        if (act.dataset.act === "buy") openCheckout();
        else { closeAll(); toast(T.added); }
      }
    });
  }

  // ------------------------------------------------------------------ cart drawer
  const lineHTML = (l, i, editable) => `
    <div class="ds-line">
      <img src="${esc(l.img)}" alt="">
      <div><b>${esc(l.name)}</b><small>${[l.color ? `<span class="ds-dot" style="background:${esc(l.color)}"></span>` : "", l.size && esc(l.size), l.link && `<bdi dir="ltr">${esc(l.link.slice(0, 38))}…</bdi>`, !editable && `× ${l.qty}`].filter(Boolean).join(" · ")}</small>
        ${editable ? `<div class="ds-qty" style="margin-top:6px"><button type="button" data-l="${i}" data-d="-1">−</button><b>${l.qty}</b><button type="button" data-l="${i}" data-d="1">+</button></div> <button type="button" class="ds-rm" data-rm="${i}">${T.remove}</button>` : ""}
      </div>
      <b>${l.price ? fmt(l.price * l.qty) : esc(T.priceLater)}</b>
    </div>`;
  function openCart() {
    closeAll();
    lastFocus = doc.activeElement;
    const bg = doc.createElement("div");
    bg.className = "ds-ov ds-dbg";
    bg.style.background = "rgba(0,0,0,.45)";
    const d = doc.createElement("aside");
    d.className = "ds-drawer";
    d.setAttribute("role", "dialog");
    d.setAttribute("aria-modal", "true");
    const paint = () => {
      d.innerHTML = `<div class="ds-dh"><b>${T.cart} (${count()})</b><button type="button" class="ds-x" aria-label="${esc(T.close)}">×</button></div>
        <div class="ds-db">${cart.length ? cart.map((l, i) => lineHTML(l, i, true)).join("") : `<div class="ds-emptyc"><span style="font-size:40px">🛒</span>${T.empty}<button type="button" class="ds-btn ds-btn-o" data-browse style="flex:none">${T.browse}</button></div>`}</div>
        ${cart.length ? `<div class="ds-df"><div class="ds-sum ds-tot"><span>${T.subtotal}</span><b>${fmt(subtotal())}</b></div><button type="button" class="ds-btn ds-btn-p" data-go>${T.checkout}</button><p class="ds-demo">${T.demo}</p></div>` : ""}`;
    };
    paint();
    d.addEventListener("click", (e) => {
      if (e.target.closest(".ds-x")) return closeAll();
      if (e.target.closest("[data-browse]")) { closeAll(); return goProducts(); }
      if (e.target.closest("[data-go]")) return openCheckout();
      const rm = e.target.closest("[data-rm]");
      if (rm) { cart.splice(+rm.dataset.rm, 1); save(); paint(); }
      const q = e.target.closest("[data-l]");
      if (q) { const l = cart[+q.dataset.l]; l.qty = Math.max(1, Math.min(20, l.qty + +q.dataset.d)); save(); paint(); }
    });
    bg.addEventListener("click", closeAll);
    doc.body.append(bg, d);
    doc.body.style.overflow = "hidden";
    d.querySelector(".ds-x").focus();
  }

  // ------------------------------------------------------------------ order form
  // mode "cart": orders the cart (or a product picked in the form when the cart is empty)
  // mode "link": the customer pastes a product link from another site (price sent later)
  function formHTML(mode, inline) {
    const delivery = DELIVERY.map((d, i) => `<label><input type="radio" name="dlv" value="${i}" ${i ? "" : "checked"}> ${esc(d.label)}${d.fee ? ` · ${fmt(d.fee)}` : d.fee === 0 ? ` · ${T.free}` : ""}</label>`).join("");
    const prodList = [...products.values()];
    const picker = `<div class="ds-f2" data-ds-picker><div class="ds-fld"><label>${T.product}</label><select class="ds-in" name="prod"><option value="">${T.chooseProduct}</option>${prodList.map((p) => `<option value="${p.id}">${esc(p.name)} — ${fmt(p.price)}</option>`).join("")}</select><span class="ds-err" data-e="prod"></span></div><div class="ds-fld" data-ds-sizewrap><label>${T.size}</label><select class="ds-in" name="psize"></select></div></div>`;
    const link = `<div class="ds-fld"><label>${T.link}</label><input class="ds-in" name="link" dir="ltr" inputmode="url" placeholder="https://www.zara.com/…"><span class="ds-err" data-e="link"></span></div>
      <div class="ds-f2"><div class="ds-fld"><label>${T.size}</label><input class="ds-in" name="lsize" placeholder="38 / M"></div><div class="ds-fld"><label>${T.color}</label><input class="ds-in" name="lcolor"></div></div>`;
    return `<div class="ds-form" ${inline ? "" : 'style="padding:28px"'}>
      ${inline ? "" : `<h3>${T.checkout}</h3>`}
      ${mode === "link" ? link : `<div data-ds-summary></div>${picker}`}
      <div class="ds-f2">
        <div class="ds-fld"><label>${T.name}</label><input class="ds-in" name="name" autocomplete="name"><span class="ds-err" data-e="name"></span></div>
        <div class="ds-fld"><label>${T.phone}</label><input class="ds-in" name="phone" type="tel" inputmode="tel" autocomplete="tel" dir="ltr" placeholder="05 55 12 34 56"><span class="ds-err" data-e="phone"></span></div>
      </div>
      <div class="ds-f2">
        <div class="ds-fld"><label>${T.wilaya}</label><select class="ds-in" name="wilaya"><option value="">${T.chooseWilaya}</option>${WILAYAS.map((w) => `<option>${esc(w)}</option>`).join("")}</select><span class="ds-err" data-e="wilaya"></span></div>
        <div class="ds-fld"><label>${T.commune}</label><input class="ds-in" name="commune"><span class="ds-err" data-e="commune"></span></div>
      </div>
      <div class="ds-pick">${delivery}</div>
      <div class="ds-fld"><label>${T.note}</label><input class="ds-in" name="note"></div>
      <div data-ds-totals></div>
      <button type="submit" class="ds-btn ds-btn-p">${T.confirm}</button>
      <p class="ds-note">${T.cod}</p>
      <p class="ds-demo">${T.demo}</p>
    </div>`;
  }

  function mountForm(box, mode, inline) {
    const form = box.tagName === "FORM" ? box : doc.createElement("form");
    form.removeAttribute("onsubmit");
    form.noValidate = true;
    form.innerHTML = formHTML(mode, inline);
    if (form !== box) { box.innerHTML = ""; box.appendChild(form); }
    box.setAttribute("data-ds-inline", "");
    const f = (n) => form.elements[n];
    const picked = () => products.get(f("prod") && f("prod").value);
    const lines = () => {
      if (mode === "link") return [];
      if (cart.length) return cart;
      const p = picked();
      return p ? [{ name: p.name, price: p.price, img: p.img, size: f("psize").value, color: "", qty: 1 }] : [];
    };
    const fee = () => DELIVERY[+form.querySelector("input[name=dlv]:checked").value].fee || 0;
    const refresh = () => {
      if (mode !== "link") {
        const sum = form.querySelector("[data-ds-summary]");
        sum.innerHTML = cart.length ? `<div class="ds-mini">${cart.map((l, i) => lineHTML(l, i, false)).join("")}</div>` : "";
        form.querySelector("[data-ds-picker]").classList.toggle("ds-hidden", !!cart.length);
        const p = picked();
        const sw = form.querySelector("[data-ds-sizewrap]");
        const sizes = (p && p.sizes) || [];
        sw.classList.toggle("ds-hidden", !sizes.length);
        const cur = f("psize").value;
        f("psize").innerHTML = sizes.map((s) => `<option ${s === cur ? "selected" : ""}>${esc(s)}</option>`).join("");
      }
      const sub = subtotal(lines());
      form.querySelector("[data-ds-totals]").innerHTML =
        mode === "link"
          ? `<div class="ds-sum ds-tot"><span>${T.price}</span><b>${T.priceLater} ✨</b></div>`
          : `<div class="ds-sum"><span>${T.subtotal}</span><span>${fmt(sub)}</span></div><div class="ds-sum"><span>${T.delivery}</span><span>${fee() ? fmt(fee()) : T.free}</span></div><div class="ds-sum ds-tot"><span>${T.total}</span><b>${fmt(sub + fee())}</b></div>`;
    };
    box.__refresh = refresh;
    form.addEventListener("change", refresh);
    refresh();
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const errs = {};
      const v = (n) => (f(n) ? f(n).value.trim() : "");
      if (v("name").length < 3) errs.name = T.errName;
      if (!/^0[567]\d{8}$/.test(v("phone").replace(/[\s.-]/g, ""))) errs.phone = T.errPhone;
      if (!v("wilaya")) errs.wilaya = T.errWilaya;
      if (v("commune").length < 2) errs.commune = T.errCommune;
      if (mode === "link" && !/^https?:\/\/\S+\.\S+/.test(v("link"))) errs.link = T.errLink;
      if (mode !== "link" && !lines().length) errs.prod = T.errProduct;
      form.querySelectorAll("[data-e]").forEach((s) => { s.textContent = errs[s.dataset.e] || ""; });
      form.querySelectorAll(".ds-in").forEach((i) => i.setAttribute("aria-invalid", !!errs[i.name]));
      const first = Object.keys(errs)[0];
      if (first) { (f(first) || form.querySelector(`[data-e=${first}]`))?.focus?.(); return; }
      const order = {
        no: `${FR ? "CMD" : "CMD"}-${Math.floor(10000 + Math.random() * 89999)}`,
        lines: mode === "link" ? [{ name: T.link, link: v("link"), size: v("lsize"), color: "", price: 0, qty: 1, img: "" }] : lines().map((l) => ({ ...l })),
        fee: fee(),
        phone: v("phone"),
      };
      const btn = form.querySelector("[type=submit]");
      btn.disabled = true;
      setTimeout(() => {
        if (mode !== "link") { cart = []; save(); }
        showDone(box, order, inline);
      }, 500);
    });
    return form;
  }

  function doneHTML(o) {
    const sub = subtotal(o.lines);
    return `<div class="ds-done">
      <div class="ds-ic">✓</div>
      <h3>${T.doneTitle}</h3>
      <p>${esc(T.doneBody(o.phone))}</p>
      <div><span class="ds-lab">${T.orderNo}</span><span class="ds-no">${o.no}</span></div>
      <div class="ds-mini" style="width:100%;text-align:start">${o.lines.map((l, i) => lineHTML(l, i, false)).join("")}${sub ? `<div class="ds-sum ds-tot" style="padding-top:8px"><span>${T.total}</span><b>${fmt(sub + o.fee)}</b></div>` : ""}</div>
      <div class="ds-row" style="width:100%"><button type="button" class="ds-btn ds-btn-p" data-keep>${T.keep}</button></div>
      <p class="ds-demo">${T.demo}</p>
    </div>`;
  }
  function showDone(box, o, inline) {
    if (inline) {
      const mode = box.__mode;
      box.innerHTML = `<div class="ds-form">${doneHTML(o)}</div>`;
      box.querySelector("[data-keep]").textContent = T.again;
      box.querySelector("[data-keep]").addEventListener("click", () => mountForm(box, mode, true));
    } else {
      const m = overlay(`<div style="padding:28px">${doneHTML(o)}</div>`, true);
      m.querySelector("[data-keep]").addEventListener("click", () => { closeAll(); goProducts(); });
    }
  }

  function openCheckout() {
    const m = overlay("", true);
    const holder = doc.createElement("div");
    m.appendChild(holder);
    mountForm(holder, "cart", false);
    setTimeout(() => holder.querySelector("[name=name]")?.focus(), 40);
  }

  // inline order forms that replace the fake ones in the page
  (C.inline || []).forEach((cfg) => {
    $$(cfg.container).forEach((box) => {
      box.__mode = cfg.mode || "cart";
      if (cfg.className) box.classList.add(...cfg.className.split(" "));
      box.classList.add("ds-inline");
      mountForm(box, box.__mode, true);
    });
  });

  // ------------------------------------------------------------------ navigation helpers
  const sec = (sel) => (sel ? $(sel) : null);
  const scrollTo = (el) => el && el.scrollIntoView({ behavior: "smooth", block: "start" });
  const findSection = (re) => $$("section,[id],footer").find((s) => re.test(text(s.querySelector("h2,h3,h5")) || ""));
  function goProducts() { scrollTo(sec(C.sections && C.sections.products) || $(groups[0] && groups[0].card)); }
  function goOrder() {
    const inl = $("[data-ds-inline]");
    if (inl && !inl.closest("[hidden],.ds-hidden")) { scrollTo(inl.closest("section") || inl); setTimeout(() => inl.querySelector("input,select")?.focus({ preventScroll: true }), 600); }
    else if (cart.length) openCheckout();
    else { goProducts(); toast(FR ? "Choisissez un produit pour commander." : "اختر منتج باش تطلب."); }
  }

  // filter product cards by a term ("a|b" = any, "!a" = not a, "sel:.x" = selector)
  function filterCards(term, scope) {
    const cards = scope ? $$(scope) : allCards();
    if (!term) { cards.forEach((c) => c.classList.remove("ds-hidden")); return true; }
    const test = (c) => {
      if (term.startsWith("sel:")) return c.matches(term.slice(4));
      if (term.startsWith("!")) return !new RegExp(term.slice(1), "i").test(c.textContent);
      return new RegExp(term, "i").test(c.textContent);
    };
    const hits = cards.filter(test);
    if (!hits.length) { cards.forEach((c) => c.classList.remove("ds-hidden")); toast(T.noMatch); return false; }
    cards.forEach((c) => c.classList.toggle("ds-hidden", !hits.includes(c)));
    return true;
  }
  const ALL = /^(الكل|tout|all)/i;

  // filter chip groups
  (C.filters || []).forEach((fc) => {
    $$(fc.buttons).forEach((b) => {
      b.style.cursor = "pointer";
      b.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopImmediatePropagation();
        $$(fc.buttons).forEach((x) => { x.classList.toggle("on", x === b); if (x.hasAttribute("aria-pressed") || x.tagName === "BUTTON") x.setAttribute("aria-pressed", x === b); });
        const label = text(b).replace(/^[^\p{L}\d]+/u, "");
        const map = fc.map || {};
        const term = ALL.test(label) ? "" : map[label] ?? label;
        filterCards(term, fc.scope);
        if (fc.scroll) scrollTo(sec(fc.scroll));
      }, true);
    });
  });

  // search box
  if (C.search) {
    $$(C.search.box).forEach((box) => {
      const span = box.querySelector(C.search.replace || "span");
      const input = doc.createElement("input");
      input.className = "ds-search";
      input.type = "search";
      input.placeholder = T.search;
      if (span) span.replaceWith(input); else box.prepend(input);
      const run = () => {
        const q = input.value.trim();
        allCards().forEach((c) => c.classList.toggle("ds-hidden", !!q && !c.textContent.toLowerCase().includes(q.toLowerCase())));
      };
      input.addEventListener("input", run);
      input.addEventListener("keydown", (e) => { if (e.key === "Enter") { run(); goProducts(); } });
      $$(C.search.button || "i", box).forEach((b) => { b.style.cursor = "pointer"; b.addEventListener("click", () => { run(); goProducts(); }); });
    });
  }

  // countdown timer (hh mm ss in three elements)
  if (C.timer) {
    const els = $$(C.timer);
    if (els.length === 3) {
      let s = (+els[0].textContent) * 3600 + (+els[1].textContent) * 60 + +els[2].textContent;
      setInterval(() => { s = s > 0 ? s - 1 : 86399; [Math.floor(s / 3600), Math.floor(s / 60) % 60, s % 60].forEach((v, i) => (els[i].textContent = String(v).padStart(2, "0"))); }, 1000);
    }
  }

  // mobile menu built from the page's own links
  if (C.menu) {
    $$(C.menu.burger).forEach((b) => {
      b.style.cursor = "pointer";
      b.setAttribute("role", "button");
      b.setAttribute("aria-label", T.menu);
      b.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopImmediatePropagation();
        const links = $$(C.menu.links).filter((a) => text(a));
        const m = overlay(`<div style="padding:24px"><b style="font-size:20px">${T.menu}</b><nav class="ds-menu" style="margin-top:12px">${links.map((a, i) => `<a href="#" data-i="${i}">${esc(text(a))}</a>`).join("")}</nav></div>`, true);
        m.addEventListener("click", (ev) => {
          const a = ev.target.closest("[data-i]");
          if (!a) return;
          ev.preventDefault();
          closeAll();
          setTimeout(() => links[+a.dataset.i].click(), 50);
        });
      }, true);
    });
  }

  // ------------------------------------------------------------------ one click handler for everything
  const OPT = C.optionSel || ".sw i,.sz span,.sizes span,.swatch i,.tabs span,.pick div,.thumbs img,.cols i,.dots i,.chips span";
  const ig = () => (C.instagram ? window.open(`https://www.instagram.com/${C.instagram}/`, "_blank", "noopener") : toast(T.soon));
  const maps = (el) => {
    const near = el.closest("div,section");
    const q = [near && text(near.querySelector("h3,h2")), C.maps].filter(Boolean).join(" ");
    window.open(`https://www.google.com/maps/search/${encodeURIComponent(q || C.maps || doc.title)}`, "_blank", "noopener");
  };

  // Toolbox for store-specific rules (C.links[].run) and C.init.
  const api = { $, $$, text, priceOf, oldPriceOf, swatchOf, openProduct, openCheckout, openCart, addLine, toast, goOrder, goProducts, filterCards, closeAll, ig, maps, T };
  if (typeof C.init === "function") C.init(api);

  doc.addEventListener(
    "click",
    (e) => {
      const t = e.target;
      if (t.closest(".ds-ov,.ds-drawer,.ds-fcart,.ds-toast")) return; // our own UI handles itself
      if (t.closest("[data-ds-inline]")) return; // live order form

      // 1. option chips (sizes, colours, tabs, delivery choices) toggle "on"
      const opt = t.closest(OPT);
      if (opt && !opt.classList.contains("x") && !t.closest("[data-ds-noopt]")) {
        [...opt.parentElement.children].forEach((c) => c.classList.toggle("on", c === opt));
        if (opt.matches(".thumbs img")) { const main = opt.closest(".view")?.querySelector(":scope > img"); if (main) main.src = opt.src; }
      }

      // 2. quantity steppers in the page
      const qs = t.closest(".qty span");
      if (qs) { const b = qs.parentElement.querySelector("b"); if (b) b.textContent = Math.max(1, Math.min(20, +b.textContent + (text(qs) === "+" ? 1 : -1))); return; }

      // 3. favourites
      const fav = t.closest(C.favSel || ".heart,.fav");
      if (fav) {
        e.preventDefault(); e.stopImmediatePropagation();
        const on = !fav.classList.contains("ds-on");
        fav.classList.toggle("ds-on", on);
        if (fav.textContent.trim().match(/^[♡♥]$/)) fav.textContent = on ? "♥" : "♡";
        fav.style.color = on ? th.accent : "";
        return toast(on ? T.fav : T.unfav);
      }

      // 4. product cards
      const card = t.closest("[data-ds-id]");
      if (card) {
        const g = groups[+card.dataset.dsGroup];
        if (g.ignore && t.closest(g.ignore)) return; // let the page's own button work
        const trig = g.trigger ? t.closest(g.trigger) : null;
        if (!trig && (!g.clickCard || opt)) return;
        e.preventDefault(); e.stopImmediatePropagation();
        const p = { ...products.get(card.dataset.dsId), ...readCard(card, g) };
        if (g.direct && trig) { addLine(p, { size: p.sel.size || (p.sizes || [])[0], color: p.sel.color || (p.colors || [])[0] }); toast(T.added); return openCart(); }
        return openProduct(p);
      }

      // 5. cart icon
      if (cartBtns.some((b) => b.contains(t))) { e.preventDefault(); e.stopImmediatePropagation(); return openCart(); }

      // 6. store-specific rules
      for (const r of C.links || []) {
        const el = t.closest(r.sel);
        if (el) { e.preventDefault(); e.stopImmediatePropagation(); return r.run(el, api); }
      }

      // 7. dead links and buttons: send them somewhere sensible
      const a = t.closest("a,button,[role=button]," + (C.soon || ".x-none"));
      if (!a) return;
      if (C.soon && a.matches(C.soon)) { e.preventDefault(); return toast(T.soon); }
      const href = a.getAttribute("href");
      const dead = a.tagName === "BUTTON" ? a.type !== "submit" && !a.onclick && !a.hasAttribute("data-i") && !a.closest("form") : href === null || href === "" || href === "#";
      if (!dead) return;
      e.preventDefault();
      const s = text(a).toLowerCase();
      const inHeader = !!a.closest("header");
      if (a.matches(C.logo || ".logo,.brand,.emblem") || (inHeader && a === $("header a"))) return window.scrollTo({ top: 0, behavior: "smooth" });
      if (/insta|إنستغرام|انستغرام|انستا/.test(s)) return ig();
      if (/خريطة|carte|map/.test(s)) return maps(a);
      if (/واتساب|whatsapp|الجروب|groupe/.test(s) || a.matches(".wa,.wa-btn")) return toast(T.wa);
      if (/^(الرئيسية|accueil|home)$/.test(s)) return window.scrollTo({ top: 0, behavior: "smooth" });
      if (/تواصل|contact/.test(s)) return scrollTo(sec(C.sections && C.sections.contact) || $("footer"));
      if (/آراء|avis|reines|reviews/.test(s)) return scrollTo(findSection(/آراء|avis|retours|reviews/i));
      if (/lookbook/.test(s)) return scrollTo(findSection(/lookbook/i) || $(".look"));
      if (/السلة|panier|bag/.test(s)) return openCart();
      if (/اطلب|اطلبي|commande|commander|order|تأكيد|أكّد|confirm/.test(s)) return goOrder();
      if (/شوف|شوفي|tout voir|découvrir|اكتشف|voir|الكل/.test(s)) return goProducts();
      // a menu or category link: filter by its mapped term (or its words), then show the products
      const mapKey = Object.keys(C.catMap || {}).sort((x, y) => y.length - x.length).find((k) => s.includes(k.toLowerCase()));
      if (mapKey !== undefined) { filterCards(C.catMap[mapKey]); return goProducts(); }
      const term = s.replace(/[^\p{L}\d\s]/gu, " ").trim().split(/\s+/).filter((w) => w.length > 2).map((w) => (w.length > 4 ? w.slice(0, 4) : w)).join("|");
      if (term && (a.closest("nav,header,.cats,.cat") || a.matches(".cat"))) filterCards(term);
      goProducts();
    },
    true,
  );

  renderCount();
})();
