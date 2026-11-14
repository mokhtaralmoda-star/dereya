const LINKS: [string, string][] = [
  ["جميع الأنشطة السياحية", "/bujairi-terrace"],
  ["المطاعم", "/bujairi-terrace"],
  ["التسوق", "/bujairi-terrace"],
  ["زيارة المعالم السياحية", "/bujairi-terrace"],
  ["ابقَ معنا", "/bujairi-terrace"],
];

export function initDiriyahMobile() {
  const btn = document.querySelector<HTMLElement>('[data-testid="hamburger-toggle"]');
  const menu = document.getElementById("mobile-menu");
  if (!btn || !menu || btn.dataset.wired) return;
  btn.dataset.wired = "1";

  const item = menu.querySelector<HTMLElement>('[data-slot="accordion-item"]');
  const trigger = item?.querySelector<HTMLButtonElement>("button");
  if (item && trigger && !item.querySelector(".clone-submenu")) {
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

  const setOpen = (open: boolean) => {
    menu.classList.toggle("is-open", open);
    btn.classList.toggle("is-open", open);
    btn.setAttribute("aria-expanded", String(open));
    document.documentElement.classList.toggle("menu-open", open);
  };

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    setOpen(!menu.classList.contains("is-open"));
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setOpen(false);
  });
}
