import { AppShell } from "@mantine/core";
import { useMantineColorScheme } from "@mantine/core";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { startSignalR, updateSubscription } from "./api/signalr";
import { GlobalStatsBanner } from "./components/GlobalStatsBanner";
import { StreamChart } from "./components/StreamChart";
import { ChainList } from "./components/ChainList";
import { TopBar } from "./components/TopBar";
import { Footer } from "./components/Footer";
import { AppDispatch, RootState } from "./store";
import { fetchGlobalMetrics, fetchHistoryPreload } from "./store/metricsSlice";
import { fetchNetworks } from "./store/networksSlice";
import { setColorScheme } from "./store/uiSlice";
import { config } from "./config";

export function App() {
  const dispatch = useDispatch<AppDispatch>();
  const includeTestnets = useSelector((s: RootState) => s.ui.includeTestnets);
  const includeSidechains = useSelector((s: RootState) => s.ui.includeSidechains);
  const globalMetrics = useSelector((s: RootState) => s.metrics.global);
  const metric = useSelector((s: RootState) => s.ui.metric);
  const colorScheme = useSelector((s: RootState) => s.ui.colorScheme);
  const { setColorScheme: mantineSetColorScheme } = useMantineColorScheme();
  const signalRStarted = useRef(false);
  const filtersMounted = useRef(false);

  useEffect(() => {
    const filters = { includeTestnets, includeSidechains };
    dispatch(fetchNetworks());
    dispatch(fetchGlobalMetrics(filters));

    const intervalId = setInterval(() => {
      dispatch(fetchGlobalMetrics(filters));
    }, config.globalPollIntervalMs);

    return () => clearInterval(intervalId);
  }, [dispatch, includeTestnets, includeSidechains]);

  // Start SignalR once on mount; server handles chain filtering via SubscribeAll
  useEffect(() => {
    signalRStarted.current = true;
    startSignalR(includeTestnets, includeSidechains).catch(console.error);
    dispatch(fetchHistoryPreload());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Re-subscribe when filter toggles change (skip initial mount)
  useEffect(() => {
    if (!filtersMounted.current) {
      filtersMounted.current = true;
      return;
    }
    updateSubscription(includeTestnets, includeSidechains).catch(console.error);
  }, [includeTestnets, includeSidechains]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "t" || e.key === "T") && e.target === document.body) {
        const next = colorScheme === "dark" ? "light" : "dark";
        dispatch(setColorScheme(next));
        mantineSetColorScheme(next);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [colorScheme, dispatch, mantineSetColorScheme]);

  useEffect(() => {
    const value = metric === "tps" ? globalMetrics?.totalTps : globalMetrics?.totalGps;
    document.title = value != null
      ? `ethtps.info - ${value.toFixed(2)} ${metric.toUpperCase()}`
      : "ethtps.info";
  }, [globalMetrics, metric]);

  return (
    <AppShell header={{ height: 56 }} footer={{ height: 36 }} padding="md">
      <AppShell.Header>
        <TopBar />
      </AppShell.Header>
      <AppShell.Main>
        <GlobalStatsBanner />
        <StreamChart />
        <ChainList />
      </AppShell.Main>
      <AppShell.Footer>
        <Footer />
      </AppShell.Footer>
    </AppShell>
  );
}
