const LINKS: [string, string][] = [
  ["جميع الأنشطة السياحية", "/bujairi-terrace"],
  ["المطاعم", "/bujairi-terrace"],
  ["التسوق", "/bujairi-terrace"],
  ["زيارة المعالم السياحية", "/bujairi-terrace"],
  ["ابقَ معنا", "/bujairi-terrace"],
];

const isOpen = () => document.documentElement.classList.contains("menu-open");

function apply(open: boolean) {
  const btn = document.querySelector<HTMLElement>('[data-testid="hamburger-toggle"]');
  const menu = document.getElementById("mobile-menu");
  menu?.classList.toggle("is-open", open);
  btn?.classList.toggle("is-open", open);
  btn?.setAttribute("aria-expanded", String(open));
  document.documentElement.classList.toggle("menu-open", open);
}

function buildSubmenu(menu: HTMLElement) {
  const item = menu.querySelector<HTMLElement>('[data-slot="accordion-item"]');
  const trigger = item?.querySelector<HTMLButtonElement>("button");
  if (!item || !trigger || item.querySelector(".clone-submenu")) return;
  const ul = document.createElement("ul");
  ul.className = "clone-submenu";
  for (const [label, href] of LINKS) {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.textContent = label;
    a.href = href;
    li.appendChild(a);
    ul.appendChild(li);
  }
  item.appendChild(ul);
  trigger.addEventListener("click", (e) => {
    e.preventDefault();
    const open = item.dataset.state !== "open";
    item.dataset.state = open ? "open" : "closed";
    trigger.setAttribute("aria-expanded", String(open));
  });
}

function wire() {
  const btn = document.querySelector<HTMLElement>('[data-testid="hamburger-toggle"]');
  const menu = document.getElementById("mobile-menu");
  if (!btn || !menu) return;
  buildSubmenu(menu);
  if (btn.dataset.wired) return;
  btn.dataset.wired = "1";
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    apply(!isOpen());
  });
  apply(isOpen());
}

export function initDiriyahMobile() {
  wire();

  const obs = new MutationObserver(() => wire());
  obs.observe(document.body, { childList: true, subtree: true });

  let n = 0;
  const timer = setInterval(() => {
    wire();
    if (++n > 24) clearInterval(timer);
  }, 250);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") apply(false);
  });

  document.addEventListener("click", (e) => {
    const a = (e.target as HTMLElement | null)?.closest?.("#mobile-menu a");
    if (a) apply(false);
  });
}
