import { SegmentedControl, Tooltip } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { setMetric } from "../store/uiSlice";

const DATA = [
  { value: "TPS", label: <Tooltip label="Transactions per second" withArrow zIndex={10001}><span>TPS</span></Tooltip> },
  { value: "GPS", label: <Tooltip label="Gas per second" withArrow zIndex={10001}><span>GPS</span></Tooltip> },
];

export function MetricToggle() {
  const dispatch = useDispatch<AppDispatch>();
  const metric = useSelector((s: RootState) => s.ui.metric);
  return (
    <SegmentedControl
      size="xs"
      value={metric.toUpperCase()}
      onChange={(v) => dispatch(setMetric(v.toLowerCase() as "tps" | "gps"))}
      data={DATA}
    />
  );
}
