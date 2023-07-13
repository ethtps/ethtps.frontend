import { Interactible, Padded, WithMargins, XYDimensions } from './Types'
import { Vector2D } from './Vector2D'

export class Interactive<T extends Partial<XYDimensions>> implements Interactible {
    private _position: Vector2D
    public get position(): Vector2D { return this._position }
    private _scale: Vector2D
    public get scale(): Vector2D { return this._scale }
    private _translation: Vector2D
    public get translation(): Vector2D { return this._translation }
    public get bounds(): [number, number, number, number] {
        return [this._position.add(this._translation).x + (this.padding?.paddingLeft ?? 0) + (this.margins?.marginLeft ?? 0), this._position.add(this._translation).y + (this.padding?.paddingTop ?? 0) + (this.margins?.marginTop ?? 0), this.innerWidth, this.innerHeight].map(x => Math.round(x)) as [number, number, number, number]
    }
    public get viewBox(): [[number, number], [number, number]] { return [[0, 0], [0, 0]] }
    public padding?: Partial<Padded> | undefined
    public margins?: Partial<WithMargins> | undefined
    public get innerWidth(): number { return this.width - (this.padding?.horizontalPadding ?? 0) - (this.margins?.horizontalMargin ?? 0) }
    public get innerHeight(): number { return this.height - (this.padding?.verticalPadding ?? 0) - (this.margins?.verticalMargin ?? 0) }
    constructor(public element: T | undefined,
        margin?: Partial<WithMargins>,
        pad?: Partial<Padded>,
        public width: number = element?.width ?? 0,
        public height: number = element?.width ?? 0,
        initialPosition: Vector2D = Vector2D.Zero(),
        initialScale: Vector2D = Vector2D.Unit(),
        initialTranslation: Vector2D = Vector2D.Zero()) {
        this._position = initialPosition
        this._scale = initialScale
        this._translation = initialTranslation
        this.padding = pad
        this.margins = margin
    }
}