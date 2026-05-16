import { AppShell } from "@mantine/core";
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
import { NetworkResponse, fetchNetworks } from "./store/networksSlice";
import { config } from "./config";

function filteredChainIds(
  networks: NetworkResponse[],
  includeTestnets: boolean,
  includeSidechains: boolean,
): number[] {
  return networks
    .filter((n) => n.enabled)
    .filter((n) => includeTestnets || !n.isTestnet)
    .filter((n) => includeSidechains || (n.networkType?.toLowerCase() ?? "") !== "sidechain")
    .map((n) => n.chainId);
}

export function App() {
  const dispatch = useDispatch<AppDispatch>();
  const networks = useSelector((s: RootState) => s.networks.networks);
  const networksStatus = useSelector((s: RootState) => s.networks.status);
  const includeTestnets = useSelector((s: RootState) => s.ui.includeTestnets);
  const includeSidechains = useSelector((s: RootState) => s.ui.includeSidechains);
  const globalMetrics = useSelector((s: RootState) => s.metrics.global);
  const metric = useSelector((s: RootState) => s.ui.metric);
  const signalRStarted = useRef(false);

  useEffect(() => {
    const filters = { includeTestnets, includeSidechains };
    dispatch(fetchNetworks());
    dispatch(fetchGlobalMetrics(filters));

    const intervalId = setInterval(() => {
      dispatch(fetchGlobalMetrics(filters));
    }, config.globalPollIntervalMs);

    return () => clearInterval(intervalId);
  }, [dispatch, includeTestnets, includeSidechains]);

  useEffect(() => {
    if (networksStatus !== "idle" || networks.length === 0 || signalRStarted.current) return;
    signalRStarted.current = true;
    const ids = filteredChainIds(networks, includeTestnets, includeSidechains);
    startSignalR(ids).catch(console.error);
    dispatch(fetchHistoryPreload());
  }, [networks, networksStatus, dispatch]); // eslint-disable-line react-hooks/exhaustive-deps

  // Re-subscribe when filters change after initial connection
  useEffect(() => {
    if (!signalRStarted.current || networks.length === 0) return;
    const ids = filteredChainIds(networks, includeTestnets, includeSidechains);
    updateSubscription(ids).catch(console.error);
  }, [networks, includeTestnets, includeSidechains]);

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
