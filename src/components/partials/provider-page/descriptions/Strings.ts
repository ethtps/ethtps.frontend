import { GenericDictionary, StringDictionary } from "@/data";

export enum DefaultStrings {
    PageSummary
}

export const AnalysisTabStrings: GenericDictionary<keyof typeof DefaultStrings> = {
    [DefaultStrings.PageSummary]: 'This page provides an overview of the provider, including its status, uptime, and the number of nodes it has. It also provides a comparison of the provider’s nodes with other providers, and a list of the provider’s nodes.'
}