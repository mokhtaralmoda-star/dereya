const AUTOPLAY_MS = 6000;

function track(c: HTMLElement) {
  return c.querySelector<HTMLElement>('[data-slot="carousel-content"] > div');
}
function items(c: HTMLElement) {
  return Array.from(c.querySelectorAll<HTMLElement>('[data-slot="carousel-item"]'));
}
function go(c: HTMLElement, i: number) {
  const list = items(c);
  if (!list.length) return;
  const n = ((i % list.length) + list.length) % list.length;
  c.dataset.index = String(n);
  const t = track(c);
  if (!t) return;
  const rtl = getComputedStyle(c).direction === "rtl";
  const gap = parseFloat(getComputedStyle(t).columnGap || "0") || 0;
  const step = list[0].getBoundingClientRect().width + gap || t.clientWidth;
  t.style.transition = "transform 700ms cubic-bezier(0.22,1,0.36,1)";
  t.style.transform = "translate3d(" + (rtl ? 1 : -1) * n * step + "px,0,0)";
  c.querySelectorAll<HTMLElement>("[data-thumb-index]").forEach((b) => {
    b.dataset.active = b.dataset.thumbIndex === String(n) ? "1" : "0";
  });
}

function wireDrag(c: HTMLElement) {
  const el = c.querySelector<HTMLElement>('[data-slot="carousel-content"]');
  if (!el || el.dataset.drag) return;
  el.dataset.drag = "1";
  let sx = 0;
  let sy = 0;
  let active = false;
  el.addEventListener("pointerdown", (e) => {
    active = true;
    sx = e.clientX;
    sy = e.clientY;
  });
  el.addEventListener("pointerup", (e) => {
    if (!active) return;
    active = false;
    const dx = e.clientX - sx;
    const dy = e.clientY - sy;
    if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) return;
    go(c, Number(c.dataset.index || 0) + (dx < 0 ? 1 : -1));
  });
  el.addEventListener("pointercancel", () => {
    active = false;
  });
}

function wireCarousels() {
  document.querySelectorAll<HTMLElement>('[data-slot="carousel"]').forEach((c) => {
    wireDrag(c);
    if (c.dataset.wired) return;
    c.dataset.wired = "1";
    c.dataset.index = "0";
    go(c, 0);
    if (c.closest('[data-testid="fullscreen-spotlight"]') || c.dataset.autoplay === "1") {
      setInterval(() => {
        if (!document.hidden) go(c, Number(c.dataset.index || 0) + 1);
      }, AUTOPLAY_MS);
    }
  });
}

function wireButtons() {
  document.querySelectorAll<HTMLElement>('[data-testid="carousel-next"]').forEach((b) => {
    if (b.dataset.w) return;
    b.dataset.w = "1";
    b.addEventListener("click", (e) => {
      e.preventDefault();
      const c = b.closest<HTMLElement>('[data-slot="carousel"]');
      if (c) go(c, Number(c.dataset.index || 0) + 1);
    });
  });
  document.querySelectorAll<HTMLElement>('[data-testid="carousel-prev"]').forEach((b) => {
    if (b.dataset.w) return;
    b.dataset.w = "1";
    b.addEventListener("click", (e) => {
      e.preventDefault();
      const c = b.closest<HTMLElement>('[data-slot="carousel"]');
      if (c) go(c, Number(c.dataset.index || 0) - 1);
    });
  });
  document.querySelectorAll<HTMLElement>('[data-testid^="thumbnail-"]').forEach((b) => {
    const idx = (b.dataset.testid || "").replace("thumbnail-", "");
    b.dataset.thumbIndex = idx;
    if (b.dataset.w) return;
    b.dataset.w = "1";
    b.addEventListener("click", (e) => {
      e.preventDefault();
      const c = b.closest<HTMLElement>('[data-slot="carousel"]');
      if (c) go(c, Number(idx));
    });
  });
}

function wireTiles() {
  if (window.innerWidth >= 768) return;
  document.querySelectorAll<HTMLElement>('[data-testid="media-tile-grid"] [data-testid="cta"] > div').forEach((w) => {
    w.style.setProperty("aspect-ratio", "1 / 1", "important");
    w.style.setProperty("height", "auto", "important");
  });
  document.querySelectorAll<HTMLElement>('[data-testid="media-tile-grid"] [data-testid="img"]').forEach((d) => {
    d.style.setProperty("position", "absolute", "important");
    d.style.setProperty("inset", "0", "important");
    d.style.setProperty("height", "100%", "important");
    d.style.setProperty("aspect-ratio", "auto", "important");
  });
}
function wire() {
  wireCarousels();
  wireButtons();
  wireTiles();
}

export function initDiriyahBehavior() {
  wire();
  if ((window as any).__db) return;
  (window as any).__db = 1;
  const obs = new MutationObserver(() => wire());
  obs.observe(document.body, { childList: true, subtree: true });
  let n = 0;
  const timer = setInterval(() => {
    wire();
    if (++n > 40) clearInterval(timer);
  }, 250);
}
