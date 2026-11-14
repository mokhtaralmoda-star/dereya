import { useEffect, useRef, useState } from "react";

export default function DiriyahPage({ lang }: { lang: "ar" | "en" }) {
  const [html, setHtml] = useState("");
  const [err, setErr] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let alive = true;
    setHtml("");
    setErr(false);
    fetch("/diriyah/" + lang + "/index.html")
      .then((r) => (r.ok ? r.text() : Promise.reject(r.status)))
      .then((txt) => {
        if (!alive) return;
        const doc = new DOMParser().parseFromString(txt, "text/html");
        doc.querySelectorAll('link[rel="stylesheet"]').forEach((l) => {
          const href = l.getAttribute("href") || "";
          const abs = href.indexOf("../") === 0 ? "/diriyah/" + href.slice(3) : href;
          if (document.getElementById("dv-" + abs)) return;
          const el = document.createElement("link");
          el.id = "dv-" + abs;
          el.rel = "stylesheet";
          el.href = abs;
          document.head.appendChild(el);
        });
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
        document.body.className = doc.body.className;
        if (doc.title) document.title = doc.title;
        const body = doc.body.innerHTML
          .replace(/<script[\s\S]*?<\/script>/gi, "")
          .replace(/\.\.\/assets\//g, "/diriyah/assets/");
        setHtml(body);
        window.scrollTo(0, 0);
      })
      .catch(() => alive && setErr(true));
    return () => { alive = false; };
  }, [lang]);

  useEffect(() => {
    if (!html || !box.current) return;
    box.current.querySelectorAll("video").forEach((v) => {
      v.setAttribute("autoplay", "");
      v.muted = true;
      v.querySelectorAll("source[data-src]").forEach((s) => {
        if (!s.getAttribute("src")) s.setAttribute("src", s.getAttribute("data-src") as string);
      });
      v.load();
      v.play().catch(() => {});
    });
    const onClick = (e: Event) => {
      const a = (e.target as HTMLElement)?.closest?.("a");
      if (!a) return;
      const h = a.getAttribute("href") || "";
      if (!h || h.charAt(0) === "#") return;
      e.preventDefault();
      if (a.getAttribute("data-testid") === "language-switcher-cta") {
        window.location.href = lang === "ar" ? "/en" : "/";
        return;
      }
      if (h.indexOf("tickets.bujairi.sa") > -1 || (h.indexOf("http") === 0 && h.indexOf("diriyah.sa") === -1)) {
        window.open(h, "_blank");
        return;
      }
      window.location.href = "/bujairi-terrace";
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [html, lang]);

  if (err) return <div style={{ padding: 60, textAlign: "center" }}>تعذّر تحميل الصفحة.</div>;
  if (!html) return <div style={{ minHeight: "70vh", background: "#FDFAF7" }} />;
  return <div ref={box} dangerouslySetInnerHTML={{ __html: html }} />;
}