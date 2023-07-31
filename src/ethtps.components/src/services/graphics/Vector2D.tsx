export class Vector2D {
    public static Zero() { return new Vector2D(0, 0) }
    public static Unit() { return new Vector2D(1, 1) }
    constructor(public x: number, public y: number) {
    }
    public add = (v: Vector2D) => new Vector2D(this.x + v.x, this.y + v.y)
    public subtract = (v: Vector2D) => new Vector2D(this.x - v.x, this.y - v.y)
    public multiply = (v: Vector2D) => new Vector2D(this.x * v.x, this.y * v.y)
    public divide = (v: Vector2D) => new Vector2D(this.x / v.x, this.y / v.y)
    public scale = (s: number) => new Vector2D(this.x * s, this.y * s)
    public dot = (v: Vector2D) => this.x * v.x + this.y * v.y
    public magnitude = () => Math.sqrt(this.x * this.x + this.y * this.y)
    public normalize = () => this.scale(1 / this.magnitude())
    public distance = (v: Vector2D) => this.subtract(v).magnitude()
    public angle = (v: Vector2D) => Math.atan2(v.y - this.y, v.x - this.x)
    public rotate = (angle: number) => new Vector2D(
        this.x * Math.cos(angle) - this.y * Math.sin(angle),
        this.x * Math.sin(angle) + this.y * Math.cos(angle),
    )
    public equals = (v: Vector2D) => this.x === v.x && this.y === v.y
    public toString = () => `(${this.x}, ${this.y})`
    public toArray = () => [this.x, this.y]
    public toObject = () => ({ x: this.x, y: this.y })
    public static fromArray = (a: [x: number, y: number]) => new Vector2D(a[0], a[1])
    public static fromObject = (o: { x: number, y: number }) => new Vector2D(o.x, o.y)
    public static fromPolar = (r: number, theta: number) => new Vector2D(r * Math.cos(theta), r * Math.sin(theta))
    public static fromAngle = (theta: number) => new Vector2D(Math.cos(theta), Math.sin(theta))
    public static fromString = (s: string) => {
        const [x, y] = s.replace(/[()]/g, '').split(',').map(parseFloat)
        return new Vector2D(x, y)
    }
    public flipX = () => new Vector2D(-this.x, this.y)
    public flipY = () => new Vector2D(this.x, -this.y)
    public flip = () => new Vector2D(-this.x, -this.y)
    public toCSS = () => `translate(${this.x},${this.y})`
    public invert = () => new Vector2D(- this.x, - this.y)
}