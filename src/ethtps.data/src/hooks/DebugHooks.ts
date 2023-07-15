import { EffectDetails, setEffect, useAppDispatch } from '../'


export function setEffectDetails(details: Partial<EffectDetails>) {
    useAppDispatch(setEffect(details))
}