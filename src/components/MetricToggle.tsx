import { SegmentedControl } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { setMetric } from "../store/uiSlice";

export function MetricToggle() {
  const dispatch = useDispatch<AppDispatch>();
  const metric = useSelector((s: RootState) => s.ui.metric);
  return (
    <SegmentedControl
      size="xs"
      value={metric.toUpperCase()}
      onChange={(v) => dispatch(setMetric(v.toLowerCase() as "tps" | "gps"))}
      data={["TPS", "GPS"]}
    />
  );
}
