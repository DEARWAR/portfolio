/* ===== EDIT THIS BLOCK ONLY ===== */
const CONFIG = {
  whatsapp: "919779569260",          // country code + number, no + or spaces
  email: "",                         // optional, e.g. "you@gmail.com" (leave "" to hide)
  linkedin: "https://www.linkedin.com/",
  github: "https://github.com/DEARWAR"
};
/* ================================= */

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const waReady = () => !/X/i.test(CONFIG.whatsapp);
const waLink = (text) => `https://wa.me/${CONFIG.whatsapp}` + (text ? `?text=${encodeURIComponent(text)}` : "");

// nav
const nav = $("#nav");
addEventListener("scroll", () => nav.classList.toggle("scrolled", scrollY > 20), { passive: true });
$("#menu")?.addEventListener("click", () => $("#navLinks").classList.toggle("open"));
$$(".nav-links a").forEach(a => a.addEventListener("click", () => $("#navLinks").classList.remove("open")));
$("#year") && ($("#year").textContent = new Date().getFullYear());

// contact links from CONFIG
$$("[data-wa]").forEach(a => {
  const msg = a.dataset.wa || "";
  a.href = waLink(msg); a.target = "_blank"; a.rel = "noopener";
});
$$("[data-email]").forEach(a => { CONFIG.email ? a.href = "mailto:" + CONFIG.email : a.remove(); });
$$("[data-linkedin]").forEach(a => a.href = CONFIG.linkedin);
$$("[data-github]").forEach(a => a.href = CONFIG.github);

// scroll reveal + skill bars
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
}), { threshold: .12 });
$$(".rv,.bar").forEach(el => io.observe(el));

// project page: active TOC link
const tocLinks = $$(".toc a");
if (tocLinks.length) {
  const so = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) tocLinks.forEach(a => a.classList.toggle("on", a.getAttribute("href") === "#" + e.target.id));
  }), { rootMargin: "-30% 0px -60% 0px" });
  $$(".block").forEach(b => so.observe(b));
}

// lightbox (generic) + gallery viewer
const lb = document.createElement("div");
lb.className = "lb";
lb.innerHTML = '<button class="x" aria-label="Close">✕</button><button class="pv" aria-label="Previous">‹</button><button class="nx" aria-label="Next">›</button><img alt=""><p></p>';
document.body.appendChild(lb);
let lbItems = [], lbI = 0;
const lbShow = n => {
  lbI = (n + lbItems.length) % lbItems.length;
  $("img", lb).src = lbItems[lbI].src;
  $("p", lb).textContent = lbItems[lbI].caption || "";
  lb.classList.add("open");
  $(".pv", lb).style.display = $(".nx", lb).style.display = lbItems.length > 1 ? "" : "none";
};
const lbClose = () => lb.classList.remove("open");
$(".x", lb).onclick = lbClose;
$(".pv", lb).onclick = e => { e.stopPropagation(); lbShow(lbI - 1); };
$(".nx", lb).onclick = e => { e.stopPropagation(); lbShow(lbI + 1); };
lb.addEventListener("click", e => { if (e.target === lb) lbClose(); });

$$("[data-zoom]").forEach(el => el.addEventListener("click", () => {
  lbItems = [{ src: el.dataset.zoom, caption: el.dataset.caption }]; lbShow(0);
}));

const viewer = $("#viewer");
let vi = 0, thumbs = [];
const vSelect = n => {
  vi = (n + thumbs.length) % thumbs.length;
  const t = thumbs[vi];
  $("#vimg").src = t.dataset.src; $("#vimg").alt = t.dataset.title;
  $("#vtitle").textContent = t.dataset.title; $("#vdesc").textContent = t.dataset.desc;
  $("#vcount").textContent = (vi + 1) + " / " + thumbs.length;
  thumbs.forEach((x, k) => x.classList.toggle("on", k === vi));
  t.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
};
if (viewer) {
  thumbs = $$(".thumb", viewer);
  thumbs.forEach((t, n) => t.addEventListener("click", () => vSelect(n)));
  $(".vp", viewer).onclick = () => vSelect(vi - 1);
  $(".vn", viewer).onclick = () => vSelect(vi + 1);
  $("#vimg").addEventListener("click", () => {
    lbItems = thumbs.map(t => ({ src: t.dataset.src, caption: t.dataset.title + " — " + t.dataset.desc }));
    lbShow(vi);
  });
}
addEventListener("keydown", e => {
  if (lb.classList.contains("open")) {
    if (e.key === "Escape") lbClose();
    if (e.key === "ArrowLeft") lbShow(lbI - 1);
    if (e.key === "ArrowRight") lbShow(lbI + 1);
  } else if (viewer && (e.key === "ArrowLeft" || e.key === "ArrowRight") && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) {
    const r = viewer.getBoundingClientRect();
    if (r.top < innerHeight && r.bottom > 0) vSelect(vi + (e.key === "ArrowRight" ? 1 : -1));
  }
});

// enquiry form -> opens WhatsApp with every detail pre-filled
const form = $("#leadForm");
if (form) {
  const q = new URLSearchParams(location.search);
  if (q.get("project")) $("#project").value = q.get("project");
  form.addEventListener("submit", e => {
    e.preventDefault();
    const err = $("#formErr"); err.style.display = "none";
    if (!waReady()) {
      err.textContent = "WhatsApp number is not configured yet (assets/js/site.js → CONFIG.whatsapp).";
      err.style.display = "block"; return;
    }
    const v = id => ($("#" + id)?.value || "").trim();
    const lines = [
      "*New project enquiry — Portfolio website*", "",
      `*Name:* ${v("name")}`,
      v("company") && `*Company:* ${v("company")}`,
      `*Phone/WhatsApp:* ${v("phone")}`,
      v("email") && `*Email:* ${v("email")}`,
      `*Project type:* ${v("type")}`,
      v("project") && v("project") !== "General enquiry" && `*Interested in:* ${v("project")}`,
      `*Budget:* ${v("budget")}`,
      `*Timeline:* ${v("timeline")}`, "",
      "*Details:*", v("message"), "",
      `_Sent from: ${location.href.split("?")[0]}_`
    ].filter(x => x !== false && x !== undefined && x !== "" || x === "");
    const url = waLink(lines.join("\n"));
    const w = window.open(url, "_blank");
    if (w) { try { w.opener = null; } catch (_) {} } else { location.href = url; }
    $("#formOk").style.display = "block";
  });
}
