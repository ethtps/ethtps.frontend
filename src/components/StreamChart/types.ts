export interface Segment {
  color: string;
  value: number;
}

export interface ColumnData {
  segments: Segment[];
  total: number;
}

export interface TooltipState {
  x: number;
  y: number;
  name: string;
  value: number;
}
