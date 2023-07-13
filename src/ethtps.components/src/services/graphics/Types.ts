import { Vector2D } from './Vector2D'

export type BoundedBox = Partial<BoundingBox> & {
    bounds: Bounds
    viewBox: ViewBoxDimensions
}

export type BoundingBox = {
    padding: Padded
    margin: WithMargins
}

export type Padded = {
    paddingLeft: number
    paddingRight: number
    paddingTop: number
    paddingBottom: number
    readonly verticalPadding: number
    readonly horizontalPadding: number
}

export type WithMargins = {
    marginTop: number
    marginBottom: number
    marginLeft: number
    marginRight: number
    readonly verticalMargin: number
    readonly horizontalMargin: number
}



export type ViewBoxDimensions = [[x: number, y: number], [width: number, height: number]]

export type XYDimensions = { width: number, height: number }

export type Extent = [min: number, max: number]

export type Bounds = [x: number, y: number, width: number, height: number]

export type SelectedSVG = d3.Selection<any, unknown, null, undefined>

const extractNumber = (x?: number) => x ?? 0
const normalizePadding = (p?: Partial<Padded>) => ({
    paddingLeft: extractNumber(p?.paddingLeft),
    paddingRight: extractNumber(p?.paddingRight),
    paddingTop: extractNumber(p?.paddingTop),
    paddingBottom: extractNumber(p?.paddingBottom),
    verticalPadding: extractNumber(p?.paddingTop) + extractNumber(p?.paddingBottom),
    horizontalPadding: extractNumber(p?.paddingLeft) + extractNumber(p?.paddingRight),
})

const normalizeMargins = (m?: Partial<WithMargins>) => ({
    marginTop: extractNumber(m?.marginTop),
    marginBottom: extractNumber(m?.marginBottom),
    marginLeft: extractNumber(m?.marginLeft),
    marginRight: extractNumber(m?.marginRight),
    verticalMargin: extractNumber(m?.marginTop) + extractNumber(m?.marginBottom),
    horizontalMargin: extractNumber(m?.marginLeft) + extractNumber(m?.marginRight),
})

export type Position = { position: Vector2D }
export type Scale = { scale: Vector2D }
export type Translation = { translation: Vector2D }
export type Interactible = Position & Scale & Translation
export type WithInteractions<T> = T & Interactible
/*
function withBounds<T extends XYDimensions>(element: T,
    margin?: Partial<WithMargins>,
    pad?: Partial<Padded>,
    initialPosition: Vector2D = Vector2D.Zero(),
    initialScale: Vector2D = Vector2D.Unit(),
    initialTranslation: Vector2D = Vector2D.Zero()):
     {
    const padding = normalizePadding(pad)
    const margins = normalizeMargins(margin)
    return {
        ...element,
        ...padding,
        ...margins,
        innerWidth: element.width - padding.horizontalPadding,
        innerHeight: element.height - padding.verticalPadding,
        position: initialPosition,
        scale: initialScale,
        translation: initialTranslation,
        getBounds: () => [0,0,0,0]
    }
}*/