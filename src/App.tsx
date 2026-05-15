import { AppShell } from "@mantine/core";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { startSignalR } from "./api/signalr";
import { GlobalStatsBanner } from "./components/GlobalStatsBanner";
import { StreamChart } from "./components/StreamChart";
import { ChainList } from "./components/ChainList";
import { TopBar } from "./components/TopBar";
import { AppDispatch, RootState } from "./store";
import { fetchGlobalMetrics } from "./store/metricsSlice";
import { fetchNetworks } from "./store/networksSlice";
import { config } from "./config";

export function App() {
  const dispatch = useDispatch<AppDispatch>();
  const networks = useSelector((s: RootState) => s.networks.networks);
  const networksStatus = useSelector((s: RootState) => s.networks.status);
  const signalRStarted = useRef(false);

  useEffect(() => {
    dispatch(fetchNetworks());
    dispatch(fetchGlobalMetrics());

    const intervalId = setInterval(() => {
      dispatch(fetchGlobalMetrics());
    }, config.globalPollIntervalMs);

    return () => clearInterval(intervalId);
  }, [dispatch]);

  useEffect(() => {
    if (networksStatus !== "idle" || networks.length === 0 || signalRStarted.current) return;
    signalRStarted.current = true;
    const chainIds = networks.map((n) => n.chainId);
    startSignalR(chainIds).catch(console.error);
  }, [networks, networksStatus]);

  return (
    <AppShell header={{ height: 56 }} padding="md">
      <AppShell.Header>
        <TopBar />
      </AppShell.Header>
      <AppShell.Main>
        <GlobalStatsBanner />
        <StreamChart />
        <ChainList />
      </AppShell.Main>
    </AppShell>
  );
}
