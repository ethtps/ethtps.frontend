import { Vector2D } from './Vector2D'

export type BoundedBox = Partial<BoundingBox> & {
    bounds: Bounds
    viewBox: ViewBoxDimensions
}

export type BoundingBox = {
    padding: Padded
    margin: WithMargins
}

export type Bounded = Padded & WithMargins
export type ExtraBounded = Partial<Bounded> & WithAbsoluteBounds & WithDimensions

export type Padded = {
    paddingLeft: number
    paddingRight: number
    paddingTop: number
    paddingBottom: number
}

export type WithMargins = {
    marginTop: number
    marginBottom: number
    marginLeft: number
    marginRight: number
}

/**
 * Bounds of the element relative to origin
 */
export type WithAbsoluteBounds = {
    left: number
    top: number
    right: number
    bottom: number
}

export type WithDimensions = {
    horizontalSize: number
    verticalSize: number
}

export type ViewBoxDimensions = [[x: number, y: number], [width: number, height: number]]

export type XYDimensions = { width: number, height: number }

export type Extent = [min: number, max: number]

export type Bounds = [x: number, y: number, width: number, height: number]

export type SelectedSVG = d3.Selection<any, unknown, null, undefined>

const extractOrDefineNumber = (x?: number) => x ?? 0
const normalizePadding = (p?: Partial<Padded>) => ({
    paddingLeft: extractOrDefineNumber(p?.paddingLeft),
    paddingRight: extractOrDefineNumber(p?.paddingRight),
    paddingTop: extractOrDefineNumber(p?.paddingTop),
    paddingBottom: extractOrDefineNumber(p?.paddingBottom),
    verticalPadding: extractOrDefineNumber(p?.paddingTop) + extractOrDefineNumber(p?.paddingBottom),
    horizontalPadding: extractOrDefineNumber(p?.paddingLeft) + extractOrDefineNumber(p?.paddingRight),
})

const normalizeMargins = (m?: Partial<WithMargins>) => ({
    marginTop: extractOrDefineNumber(m?.marginTop),
    marginBottom: extractOrDefineNumber(m?.marginBottom),
    marginLeft: extractOrDefineNumber(m?.marginLeft),
    marginRight: extractOrDefineNumber(m?.marginRight),
    verticalMargin: extractOrDefineNumber(m?.marginTop) + extractOrDefineNumber(m?.marginBottom),
    horizontalMargin: extractOrDefineNumber(m?.marginLeft) + extractOrDefineNumber(m?.marginRight),
})

export type Position = { position: Vector2D }
export type Scale = { scale: Vector2D }
export type Translation = { translation: Vector2D }
export type Interactible = Position & Scale & Translation
export type WithInteractions<T> = T & Interactible