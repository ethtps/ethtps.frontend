import { DEBUG } from '@/ethtps.data'
import { ETHTPSDataCoreModelsResponseModelsProviderResponseModel } from 'ethtps.api'

export interface NavItem {
  label: string
  subLabel?: string
  children?: Array<NavItem>
  href?: string
}

export const NAV_ITEMS = (
  allProviders?: ETHTPSDataCoreModelsResponseModelsProviderResponseModel[]
): Array<NavItem> => {
  const extra: NavItem[] = DEBUG ? [{
    label: "Admin",
    href: "/admin/home"
  }] : []
  return extra.concat([
    {
      label: 'Rollups',
      children: [
        {
          label: 'All networks',
          subLabel: 'Ethereum L2s, sidechains, and more',
          href: '/providers/Ethereum',
          children: allProviders?.map((provider) => ({
            label: provider.name ?? '',
            subLabel: '',
            href: `/networks/${provider.name}?expanded=true`
          }))
        },
        {
          label: 'How Ethereum scales',
          subLabel: 'Current Ethereum model and the future of Ethereum scaling',
          href: '/how-ethereum-scales'
        }
      ]
    },
    {
      label: 'Status',
      href: '/status'
    },
    {
      label: 'About',
      href: '/about'
    }
  ])
}
