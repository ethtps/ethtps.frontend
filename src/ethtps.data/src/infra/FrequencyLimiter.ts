import { GenericDictionary, debounce } from '../'

/**
 * A class that can be used to limit a function call. GREATLY improves performance though it shouldn't be needed - Mister Eth's still learning...
 */
export class FrequencyLimiter {
    private static _lastCalls: GenericDictionary<number> = {}
    public static maxFrequency: number = 1000 / 60
    public static canExecute(name: string, frequency: number = FrequencyLimiter.maxFrequency): boolean {
        const now = Date.now()
        const lastCall = FrequencyLimiter._lastCalls[name]
        if (lastCall && (now - lastCall) < frequency) {
            return false
        }
        FrequencyLimiter._lastCalls[name] = now
        return true
    }
    /**
     * Same as canExecute but doesn't set the last call time
     * @param name
     * @param frequency
     * @returns
     */
    public static willExecute(name: string, frequency: number = FrequencyLimiter.maxFrequency): boolean {
        const now = Date.now()
        const lastCall = FrequencyLimiter._lastCalls[name]
        if (lastCall && (now - lastCall) < frequency) {
            return false
        }
        return true
    }

    public static debounce(name: string, callback: () => void, frequency: number = FrequencyLimiter.maxFrequency) {
        debounce(callback, frequency)()
    }
}