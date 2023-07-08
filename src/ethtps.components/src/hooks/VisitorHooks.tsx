import moment from "moment-timezone"

export enum VisitType {
    InitialOrOld = 'initialOrOld',
    ReturningOrNavigating = 'returningOrNavigating'
}

export const useLastVisitTime = () => {
    if (typeof window === 'undefined') return undefined
    if (!localStorage.getItem('lastVisitTime')) return undefined
    return moment(localStorage.getItem('lastVisitTime')!)
}

export const useVisitType = () => {
    const lastVisitTime = useLastVisitTime()
    if (!lastVisitTime) return VisitType.InitialOrOld
    const visitType = moment().diff(lastVisitTime, 'days') > 1 ? VisitType.InitialOrOld : VisitType.ReturningOrNavigating
    return visitType as VisitType
}