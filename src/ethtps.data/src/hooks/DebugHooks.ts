import { EffectDetails, FrequencyLimiter, setEffect, useAppDispatch } from '../'


export function setEffectDetails(details: Partial<EffectDetails>) {
    FrequencyLimiter.canExecute('setEffectDetails') &&
        useAppDispatch(setEffect(details))
}