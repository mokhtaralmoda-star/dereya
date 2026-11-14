export function initDiriyahDebug() {
  if (!new URLSearchParams(location.search).has("debug")) return;
  if ((window as any).__dbg) return;
  (window as any).__dbg = 1;
  const d = document.createElement("div");
  d.style.cssText =
    "position:fixed;z-index:99999;top:0;left:0;right:0;background:#000;color:#0f0;font:11px monospace;padding:6px;white-space:pre-wrap;direction:ltr";
  const upd = () => {
    const de = document.documentElement;
    const wide = Array.from(document.querySelectorAll("body *"))
      .map((el) => ({ el: el as HTMLElement, r: el.getBoundingClientRect() }))
      .filter((x) => x.r.right > de.clientWidth + 2 || x.r.left < -2)
      .slice(0, 6)
      .map((x) => x.el.tagName + "|" + String(x.el.className).slice(0, 34) + "|L" + Math.round(x.r.left) + " R" + Math.round(x.r.right));
    d.textContent =
      "iw=" + innerWidth + " cw=" + de.clientWidth + " sw=" + de.scrollWidth + " sx=" + Math.round(scrollX) + "\n" + wide.join("\n");
  };
  document.body.appendChild(d);
  upd();
  setInterval(upd, 800);
}
