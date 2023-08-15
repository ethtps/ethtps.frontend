import { Behavior, EffectDetails, LogDetails } from '.'
import { DEBUG, FrequencyLimiter, GenericDictionary } from '../../'


abstract class BasicBehavior<T extends { name: string }> implements Behavior<Partial<T>>{
    public add(effect: Partial<T>) {
        this.effs = {
            ...this.effs,
            [this.getKey(effect)]: effect
        }
    }
    protected getKey(effect: Partial<T>) {
        return effect.name ?? 'UnknownEffect'
    }

    protected callSubs() {
        Object.keys(this.subs).forEach((k, i) => FrequencyLimiter.debounce(`debugSub${k}${i}`, this.subs[k]), 500)
    }
    protected effs = {} as GenericDictionary<Partial<T>>
    protected subs = {} as GenericDictionary<() => void>
    public getAll() {
        return this.effs
    }
    public subscribe(callback: () => void, subscriptionName: string) {
        console.log('subscribed ' + subscriptionName)
        this.subs = {
            ...this.subs,
            [subscriptionName]: callback
        }
    }
}

export class BasicEffectBehavior extends BasicBehavior<EffectDetails> {
    public override add(effect: Partial<EffectDetails>) {
        const k = this.getKey(effect)
        effect = {
            name: effect?.name ?? 'UnknownEffect',
            group: effect?.group ?? 'UnknownType',
            timeMs: effect?.timeMs ?? 0,
            totalTimeMs: this.effs[k]?.totalTimeMs ?? 0,
            totalCalls: this.effs[k]?.totalCalls ?? 0,
        }
        effect.totalTimeMs! += effect.timeMs!
        effect.totalTimeMs = Math.round(effect.totalTimeMs! * 100) / 100
        effect.totalCalls!++
        super.add(effect)
        this.callSubs()
    }
    protected override getKey(effect: Partial<EffectDetails>): string {
        return `${effect.group ?? 'UnknownType'}_${effect.name ?? 'UnknownEffect'}`
    }
}

export class BasicLogBehavior extends BasicBehavior<LogDetails>{
    constructor(private _maxEntries: number = 10) {
        super()
    }
    public override add(effect: Partial<LogDetails>) {
        effect.name ??= 'UnknownLog'
        if (Object.keys(this.effs).length > this._maxEntries) {
            delete this.effs[Object.keys(this.effs)[0]]
        }
        super.add(effect)
        this.callSubs()
    }
}

export class DebugBehaviors {
    public static effectBehavior: BasicEffectBehavior
    public static logBehavior: BasicLogBehavior

    static {
        DebugBehaviors.effectBehavior = new BasicEffectBehavior()
        DebugBehaviors.logBehavior = new BasicLogBehavior()
    }
}

export function logToOverlay(log: Partial<LogDetails>) {
    if (log.level === 'debug' && !DEBUG) return
    DebugBehaviors.logBehavior.add(log)
}