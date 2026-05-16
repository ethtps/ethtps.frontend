import { schemeTableau10 } from "d3-scale-chromatic";

export const THRESHOLD = 5;
export const OTHER_COLOR = "#868e96";
export const CHAIN_COLORS: readonly string[] = schemeTableau10;
export const HEIGHT = 400;
export const AXIS_W = 48;
export const TIME_AXIS_H = 20;
export const SCROLL_DURATION_MS = 60_000;
export const MIN_LOOKBACK_MS = 5_000;
export const MAX_LOOKBACK_MS = 900_000;
export const MAX_REDRAW_THRESHOLD = 0.01;
