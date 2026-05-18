import { MutableRefObject } from "react";
import { AppDispatch } from "../../../store";
import { LiveMetricsResponse } from "../../../store/metricsSlice";
import { NetworkResponse } from "../../../store/networksSlice";
import { ColumnData, TooltipState } from "../types";

/** All shared mutable state for a mounted chart instance. Created once inside the main useEffect. */
export interface EngineCtx {
  // DOM (stable for the lifetime of the effect)
  canvas: HTMLCanvasElement;
  overlay: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  overlayCtx: CanvasRenderingContext2D;

  // History buffer — mutated in-place so every module sees the same array
  history: ColumnData[];
  bufferOldestTs: MutableRefObject<number>;
  isFetchingHistory: MutableRefObject<boolean>;
  noMoreHistory: MutableRefObject<boolean>;
  setIsLoadingHistory: MutableRefObject<(v: boolean) => void>;

  // Layout
  canvasW: MutableRefObject<number>;
  H: MutableRefObject<number>;
  streamW: MutableRefObject<number>;
  lastTs: MutableRefObject<number>;
  isFullscreen: MutableRefObject<boolean>;

  // Pan state
  panOffset: MutableRefObject<number>;
  isDragging: MutableRefObject<boolean>;
  dragStartX: MutableRefObject<number>;
  dragStartPan: MutableRefObject<number>;
  isPanned: MutableRefObject<boolean>;
  setIsPanned: MutableRefObject<(v: boolean) => void>;
  needsLiveRedraw: MutableRefObject<boolean>;

  // Render bookkeeping
  max: MutableRefObject<number>;
  lastMax: MutableRefObject<number>;

  // Settings — updated every render via ref pattern so closures see fresh values
  lookbackMs: MutableRefObject<number>;
  metric: MutableRefObject<"tps" | "gps">;
  networks: MutableRefObject<NetworkResponse[]>;
  smoothGraph: MutableRefObject<boolean>;
  excludeLowThroughput: MutableRefObject<boolean>;
  colorScheme: MutableRefObject<string>;
  live: MutableRefObject<Record<number, LiveMetricsResponse>>;

  // Callbacks
  setTooltip: (t: TooltipState | null) => void;
  dispatch: MutableRefObject<AppDispatch>;
  resetLookbackRef: MutableRefObject<() => void>;
}
