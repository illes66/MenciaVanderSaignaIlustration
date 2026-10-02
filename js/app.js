/* Lógica del portfolio. Los ajustes están en js/config.js y los colores en css/styles.css */
(function () {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const GROUPS = [
    { key: "type", label: "Tipo" },
    { key: "technique", label: "Técnica" },
    { key: "project", label: "Proyecto" }
  ];
  let items = [], group = "type", current = null, idx = 0, timer = null, slideTimer = null;

  const norm = (s) => String(s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase();
  const safeUrl = (u) => /^(https?:|\/|\.\/|images\/|assets\/)/i.test(u) || !/^[a-z][a-z0-9+.-]*:/i.test(u) ? u : "";

  /* CSV parser (admite comillas y saltos de línea) */
  function parseCSV(text) {
    const rows = []; let row = [], f = "", q = false;
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (q) {
        if (c === '"') { if (text[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += c;
      } else if (c === '"') q = true;
      else if (c === ",") { row.push(f); f = ""; }
      else if (c === "\n" || c === "\r") {
        if (c === "\r" && text[i + 1] === "\n") i++;
        row.push(f); f = ""; rows.push(row); row = [];
      } else f += c;
    }
    if (f || row.length) { row.push(f); rows.push(row); }
    return rows;
  }

  /* Convierte enlaces de Google Drive en URL de imagen visible */
  function imageUrl(raw) {
    raw = raw.trim();
    if (!raw) return "";
    const m = raw.match(/drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?id=)([\w-]+)/);
    if (m) return "https://drive.google.com/thumbnail?id=" + m[1] + "&sz=w1600";
    if (/^https?:\/\//i.test(raw)) return raw;
    return safeUrl(IMAGE_BASE_URL + raw);
  }

  function toItems(rows) {
    if (rows.length < 2) return [];
    const head = rows[0].map(norm);
    const col = {};
    Object.keys(COLUMNS).forEach((k) => { col[k] = head.findIndex((h) => COLUMNS[k].map(norm).includes(h)); });
    const get = (r, k) => (col[k] >= 0 ? (r[col[k]] || "").trim() : "");
    const out = rows.slice(1).map((r) => ({
      title: get(r, "title"),
      description: get(r, "description"),
      type: get(r, "type"),
      technique: get(r, "technique"),
      project: get(r, "project"),
      images: get(r, "image").split(/[\n,;]+/).map(imageUrl).filter(Boolean),
      shop: get(r, "shop"),
      status: norm(get(r, "status"))
    })).filter((i) => i.images.length &&
      (!PUBLISH_STATUSES.length || !i.status || PUBLISH_STATUSES.map(norm).includes(i.status)));
    return out;
  }

  /* Categorías */
  function renderTabs() {
    const box = $("groupTabs"); box.textContent = "";
    GROUPS.forEach((g) => {
      const b = document.createElement("button");
      b.type = "button"; b.textContent = g.label; b.setAttribute("role", "tab");
      if (g.key === group) b.classList.add("active");
      b.onclick = () => { group = g.key; renderTabs(); renderCategories(); };
      box.appendChild(b);
    });
  }
  function renderCategories() {
    const ul = $("categoryList"); ul.textContent = "";
    const values = [...new Set(items.map((i) => i[group]).filter(Boolean))].sort();
    if (!values.length) { const li = document.createElement("li"); li.textContent = "Sin categorías todavía"; ul.appendChild(li); }
    values.forEach((v) => {
      const li = document.createElement("li"), b = document.createElement("button");
      b.type = "button"; b.textContent = v;
      b.onclick = () => { ul.querySelectorAll("button").forEach((x) => x.classList.remove("active")); b.classList.add("active"); selectCategory(v); };
      li.appendChild(b); ul.appendChild(li);
    });
  }

  /* Selección: el item seleccionado ocupa el centro y desaparece el landing */
  function selectCategory(value) {
    const matches = items.filter((i) => i[group] === value);
    current = { entries: matches, images: [] };
    matches.forEach((m) => m.images.forEach((src) => current.images.push({ src, item: m })));
    current.images = current.images.slice(0, CAROUSEL.maxImages);
    $("landing").hidden = true; $("gallery").hidden = false; $("status").textContent = "";
    clearInterval(slideTimer);
    renderThumbs(); show(0);
  }
  function renderThumbs() {
    const box = $("thumbs"); box.textContent = "";
    current.images.forEach((im, i) => {
      const b = document.createElement("button"), img = document.createElement("img");
      b.type = "button"; img.src = im.src; img.alt = im.item.title || ""; img.draggable = false;
      b.appendChild(img); b.onclick = () => { show(i); resetAuto(); }; box.appendChild(b);
    });
  }
  function show(i) {
    const n = current.images.length; if (!n) return;
    idx = (i + n) % n;
    const im = current.images[idx], img = $("mainImage");
    img.style.animation = "none"; void img.offsetWidth; img.style.animation = "";
    img.src = im.src; img.alt = im.item.title || "";
    [...$("thumbs").children].forEach((b, k) => b.classList.toggle("active", k === idx));
    renderInfo(im.item);
  }
  function resetAuto() {
    clearInterval(timer);
    if (CAROUSEL.autoplayMs > 0) timer = setInterval(() => show(idx + 1), CAROUSEL.autoplayMs);
  }

  /* Panel de descripción + tags */
  function renderInfo(it) {
    $("newsPanel").hidden = true; $("infoPanel").hidden = false;
    $("infoTitle").textContent = it.title || it.project || "";
    $("infoDesc").textContent = it.description || "";
    const tags = $("infoTags"); tags.textContent = "";
    [["technique", "Técnica"], ["type", "Tipo"], ["project", "Proyecto"]].forEach(([k]) => {
      if (!it[k]) return;
      const s = document.createElement("span"); s.className = "tag " + k; s.textContent = it[k]; tags.appendChild(s);
    });
    const shop = $("shopBtn"), href = shopHref(it.shop);
    shop.hidden = !href;
    if (href) { shop.href = href; shop.textContent = SHOP.buttonLabel; }
  }
  function shopHref(v) {
    if (!SHOP.enabled || !v) return "";
    const u = /^https?:\/\//i.test(v) ? v : SHOP.baseUrl + v;
    return /^https:\/\//i.test(u) ? u : "";
  }

  function home() {
    clearInterval(timer);
    $("gallery").hidden = true; $("landing").hidden = false;
    $("infoPanel").hidden = true; $("newsPanel").hidden = false;
    $("categoryList").querySelectorAll("button").forEach((x) => x.classList.remove("active"));
  }

  function setupStatic() {
    SOCIAL_LINKS.forEach((s) => {
      const a = document.createElement("a"); a.href = s.url; a.textContent = s.name;
      a.target = "_blank"; a.rel = "noopener"; $("social").appendChild(a);
    });
    const mail = $("footMail"); mail.href = "mailto:" + SITE.email; mail.textContent = SITE.email;
    $("footCopy").textContent = SITE.copyright.replace("{year}", new Date().getFullYear()).replace("{owner}", SITE.owner);
    NEWS.forEach((n) => {
      const li = document.createElement("li"), t = document.createElement("time");
      t.textContent = n.date; li.appendChild(t); li.appendChild(document.createTextNode(n.text)); $("newsFeed").appendChild(li);
    });
    const v = $("landingVideo");
    if (LANDING.video) { v.src = LANDING.video; if (LANDING.poster) v.poster = LANDING.poster; }
    else if (LANDING.slides.length) {
      v.remove(); const box = $("landingSlides"); box.hidden = false;
      const img = document.createElement("img"); box.appendChild(img);
      let k = 0; const step = () => { img.src = LANDING.slides[k++ % LANDING.slides.length]; };
      step(); if (LANDING.slides.length > 1) slideTimer = setInterval(step, LANDING.slideIntervalMs);
    } else v.remove();
    $("prevBtn").onclick = () => { show(idx - 1); resetAuto(); };
    $("nextBtn").onclick = () => { show(idx + 1); resetAuto(); };
    $("backBtn").onclick = home;
    document.addEventListener("keydown", (e) => {
      if ($("gallery").hidden) return;
      if (e.key === "ArrowLeft") show(idx - 1); else if (e.key === "ArrowRight") show(idx + 1);
    });
    $("mainImage").addEventListener("contextmenu", (e) => e.preventDefault());
    $("mainImage").addEventListener("dragstart", (e) => e.preventDefault());
  }

  async function load() {
    try {
      const res = await fetch(SHEET_CSV_URL);
      if (!res.ok) throw new Error(res.status);
      items = toItems(parseCSV(await res.text()));
      if (!items.length) $("status").textContent = "Próximamente: las ilustraciones se están preparando.";
    } catch (e) {
      $("status").textContent = "No se pudo cargar la galería.";
    }
    renderTabs(); renderCategories();
  }

  setupStatic(); load();
})();
