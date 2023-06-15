import { IIndexPageProps } from '@/pages'

export const OrderProvidersByMax = (model: IIndexPageProps) => {
    const { providerData, maxData } = model
    const providersByMax = providerData?.sort((a, b) => {
        if ((maxData?.tpsData?.[a.name ?? ""]?.value ?? 0) > (maxData?.tpsData?.[b.name ?? ""]?.value ?? 0)) {
            return -1
        }
        else if ((maxData?.tpsData?.[a.name ?? ""]?.value ?? 0) < (maxData?.tpsData?.[b.name ?? ""]?.value ?? 0)) {
            return 1
        }
        return 0
    })
    model.providerData = providersByMax
    return model
}