import { MutableRefObject, useEffect, useState } from "react";

export function useFullscreen(resetLookbackRef: MutableRefObject<() => void>) {
  const [isFullscreen, setIsFullscreen] = useState(() => window.location.pathname === "/live");

  useEffect(() => {
    const path = isFullscreen ? "/live" : "/";
    if (window.location.pathname !== path) history.pushState(null, "", path);
  }, [isFullscreen]);

  useEffect(() => {
    const onPop = () => setIsFullscreen(window.location.pathname === "/live");
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
        return;
      }
      if ((e.key === "f" || e.key === "F") && e.target === document.body)
        setIsFullscreen((f) => !f);
      if ((e.key === "r" || e.key === "R") && e.target === document.body)
        resetLookbackRef.current();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isFullscreen, resetLookbackRef]);

  return { isFullscreen, setIsFullscreen };
}
