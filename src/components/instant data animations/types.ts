export type StreamGraphProps = {
  width: number
  height: number
  animate?: boolean
}

export type MouseOverEvents = {
  onMouseOver?: () => void,
  onMouseLeave?: () => void,
  onClick?: () => void
}

export const range = (n: number) => Array.from(new Array(n), (_, i) => i)
