import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from ".";
import { removeAlert } from "./alertsSlice";

export function useAlertEngine() {
  const dispatch = useDispatch<AppDispatch>();
  const live = useSelector((s: RootState) => s.metrics.live);
  const alerts = useSelector((s: RootState) => s.alerts.alerts);

  const prevTpsRef = useRef<Record<number, number | null>>({});
  const alertsRef = useRef(alerts);
  alertsRef.current = alerts;

  useEffect(() => {
    const current = alertsRef.current;
    if (current.length === 0) return;

    const toRemove: string[] = [];
    for (const alert of current) {
      const currentTps = live[alert.chainId]?.tps ?? null;
      const previousTps = prevTpsRef.current[alert.chainId] ?? null;

      if (currentTps != null && previousTps != null && previousTps < alert.threshold && currentTps >= alert.threshold) {
        if (Notification.permission === "granted") {
          new Notification(`${alert.chainName} crossed ${alert.threshold} TPS`, {
            body: `Current: ${currentTps.toFixed(2)} TPS`,
            tag: alert.id,
          });
        }
        if (!alert.persist) toRemove.push(alert.id);
      }

      prevTpsRef.current[alert.chainId] = currentTps;
    }

    for (const id of toRemove) dispatch(removeAlert(id));
  }, [live]); // eslint-disable-line react-hooks/exhaustive-deps
}
