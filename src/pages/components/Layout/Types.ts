import { ProviderResponseModel } from '@/api-client'

export interface NavItem {
    label: string
    subLabel?: string
    children?: Array<NavItem>
    href?: string
}

export const NAV_ITEMS = (allProviders?: ProviderResponseModel[]): Array<NavItem> => [
    {
        label: 'Rollups',
        children: [
            {
                label: 'All networks',
                subLabel: 'Ethereum L2s, sidechains, and more',
                href: '/networks',
                children: allProviders?.map((provider) => ({
                    label: provider.name ?? "",
                    subLabel: "",
                    href: `/networks/${provider.name}`,
                })),
            },
            {
                label: 'How Ethereum scales',
                subLabel: 'Current Ethereum model and the future of Ethereum scaling',
                href: '/how-ethereum-scales',
            },
        ],
    },
    {
        label: 'Status',
        href: '/status',
    },
    {
        label: 'About',
        href: '/about',
    },
]