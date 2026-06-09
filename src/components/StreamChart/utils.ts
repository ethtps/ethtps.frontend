import {
  schemeTableau10,
  schemeObservable10,
  schemeSet1,
  schemeDark2,
  schemeAccent,
  schemePaired,
  schemeSet2,
  schemeSet3,
} from "d3-scale-chromatic";

function buildPalette(): string[] {
  // Interleave multiple palettes so successive color assignments stay distinct.
  // Pastel schemes are omitted — too low-contrast on the chart canvas.
  const palettes: readonly (readonly string[])[] = [
    schemeTableau10,
    schemeObservable10,
    schemeSet1,
    schemeDark2,
    schemeAccent,
    schemePaired,
    schemeSet2,
    schemeSet3,
  ];
  const seen = new Set<string>();
  const result: string[] = [];
  const maxLen = Math.max(...palettes.map((p) => p.length));
  for (let i = 0; i < maxLen; i++) {
    for (const palette of palettes) {
      if (i < palette.length) {
        const key = palette[i].toLowerCase();
        if (!seen.has(key)) {
          seen.add(key);
          result.push(palette[i]);
        }
      }
    }
  }
  return result;
}

const PALETTE = buildPalette();
const colorRegistry = new Map<number, string>();
let nextSlot = 0;

export function chainColor(chainId: number): string {
  let color = colorRegistry.get(chainId);
  if (color === undefined) {
    color = PALETTE[nextSlot % PALETTE.length];
    nextSlot++;
    colorRegistry.set(chainId, color);
  }
  return color;
}

export function siFormat(v: number): string {
  if (v >= 1e9) return `${(v / 1e9).toFixed(1)}B`;
  if (v >= 1e6) return `${(v / 1e6).toFixed(1)}M`;
  if (v >= 1e3) return `${(v / 1e3).toFixed(1)}k`;
  return v.toFixed(1);
}

export function hexToRgb(hex: string): [number, number, number] {
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
}
