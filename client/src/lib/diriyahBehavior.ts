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
  t.style.transition = "transform 700ms cubic-bezier(0.22,1,0.36,1)";
  t.style.transform = "translate3d(" + (rtl ? 1 : -1) * n * 100 + "%,0,0)";
  c.querySelectorAll<HTMLElement>("[data-thumb-index]").forEach((b) => {
    b.dataset.active = b.dataset.thumbIndex === String(n) ? "1" : "0";
  });
}

function wireCarousels() {
  document.querySelectorAll<HTMLElement>('[data-slot="carousel"]').forEach((c) => {
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

function wire() {
  wireCarousels();
  wireButtons();
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
