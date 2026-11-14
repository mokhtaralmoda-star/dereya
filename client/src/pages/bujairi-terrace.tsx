import { resolveBujairiIframePath } from "../lib/bujairiPresence";

export default function Page() {
  const lang = new URLSearchParams(window.location.search).get("lang") === "en" ? "en" : "ar";
  const fallback = "/bujairi/" + lang + "/index.html";
  return (
    <iframe
      src={resolveBujairiIframePath(fallback)}
      title="Bujairi Terrace"
      style={{ position: "fixed", inset: 0, width: "100%", height: "100%", border: 0, background: "#FAF7F2", zIndex: 1 }}
    />
  );
}
