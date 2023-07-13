import { Interactive } from './Interactive'
import { Padded, WithMargins, XYDimensions } from './Types'
import { Vector2D } from './Vector2D'

export function makeInteractive<T extends Partial<XYDimensions>>(element: T | undefined,
    margin?: Partial<WithMargins>,
    pad?: Partial<Padded>,
    initialPosition: Vector2D = Vector2D.Zero(),
    initialScale: Vector2D = Vector2D.Unit(),
    initialTranslation: Vector2D = Vector2D.Zero()): Interactive<T> {
    return new Interactive(element, margin, pad, element?.width, element?.height, initialPosition, initialScale, initialTranslation)
}