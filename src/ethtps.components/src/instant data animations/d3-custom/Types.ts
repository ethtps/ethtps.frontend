
export type CustomInterval<T> = [min: T, max: T]
export type NumericInterval = CustomInterval<number>
export type TimeInterval = CustomInterval<Date>