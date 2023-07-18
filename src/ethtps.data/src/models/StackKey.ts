export interface StackKey<T extends SimpleStackKey> {
    readonly key: T
}

export interface SimpleStackKey {
    readonly value: string
}

export interface LiveDataPointKey extends SimpleStackKey {
    readonly provider: string
    readonly x: number
}