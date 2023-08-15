import { GenericDictionary } from "../.."

export const getColorForLevel = (level?: string) => {
    if (!level) return undefined
    if (level === 'info') return 'green'
    if (level === 'warn') return 'yellow'
    if (level === 'error') return 'red'
    return 'purple'
}

export const getColorForRenderTime = (timeMs?: number) => {
    if (timeMs === undefined) return 'gray'
    if (timeMs < 5) return 'green'
    if (timeMs < 8) return 'yellow'
    if (timeMs < 16) return 'orange'
    if (timeMs < 30) return 'red'
    return 'purple'
}

export interface EffectDetails {
    timeMs: number
    totalTimeMs: number
    name: string
    group?: string
    totalCalls: number
    childrenDetails?: EffectDetails[]
}

export class LogDetails implements ILogDetails {
    public level: 'info' | 'warn' | 'error' | 'debug'
    public name: string
    public details?: string | number | any
    /**
     * An alias for the name property
     */
    public get title() {
        return this.name
    }
    public set title(value) {
        this.name = value
    }

    constructor(name: string, level: 'info' | 'warn' | 'error' | 'debug', details?: string | number | any) {
        this.name = name
        this.level = level
        this.details = details
    }
}

export type ILogDetails = {
    level: 'info' | 'warn' | 'error' | 'debug'
    name: string
    details?: string | number | any
}

export type Behavior<T> = {
    getAll: () => GenericDictionary<T>,
    add: (effect: T) => void,
    subscribe: (callback: () => void, key: string) => void
}

export type EffectBehavior = Behavior<Partial<EffectDetails>>
export type LogBehavior = Behavior<Partial<LogDetails>> & {
    maxEntries: number
}

export interface DebugModel {
    effects?: EffectBehavior
    enabled: boolean
}