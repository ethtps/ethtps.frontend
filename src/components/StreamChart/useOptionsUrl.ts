import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import {
  setExcludeLowThroughputChains,
  setIncludeSidechains,
  setIncludeTestnets,
  setSmoothGraph,
} from "../../store/uiSlice";

export function useOptionsUrl(isFullscreen: boolean) {
  const dispatch = useDispatch<AppDispatch>();
  const includeTestnets = useSelector((s: RootState) => s.ui.includeTestnets);
  const includeSidechains = useSelector((s: RootState) => s.ui.includeSidechains);
  const excludeLowThroughputChains = useSelector((s: RootState) => s.ui.excludeLowThroughputChains);
  const smoothGraph = useSelector((s: RootState) => s.ui.smoothGraph);

  const initialSearch = useRef(
    window.location.pathname === "/live" ? window.location.search : ""
  );
  const syncReady = useRef(false);

  // On direct navigation to /live?o=..., apply the encoded options to Redux
  useEffect(() => {
    if (!initialSearch.current) return;
    const o = new URLSearchParams(initialSearch.current).get("o") ?? "";
    dispatch(setIncludeTestnets(o.includes("tn")));
    dispatch(setIncludeSidechains(o.includes("sd")));
    dispatch(setExcludeLowThroughputChains(!o.includes("lt")));
    dispatch(setSmoothGraph(o.includes("sm")));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Keep the URL in sync with current options while in fullscreen
  useEffect(() => {
    if (!syncReady.current) {
      syncReady.current = true;
      return;
    }
    if (!isFullscreen) return;
    const o = [
      includeTestnets ? "tn" : "",
      includeSidechains ? "sd" : "",
      !excludeLowThroughputChains ? "lt" : "",
      smoothGraph ? "sm" : "",
    ].join("");
    history.replaceState(null, "", `/live${o ? `?o=${o}` : ""}`);
  }, [isFullscreen, includeTestnets, includeSidechains, excludeLowThroughputChains, smoothGraph]);
}
