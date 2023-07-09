import {
	ETHTPSDataCoreModelsResponseModelsProviderResponseModel,
	ETHTPSDataIntegrationsMSSQLProviderLink,
} from 'ethtps.api'
import { ProviderLinks } from '../../../..'
import { ETHTPSApi } from '../../../../../ethtps.data/src'

interface IDetailsTabProps {
	provider: ETHTPSDataCoreModelsResponseModelsProviderResponseModel
	providerLinks?: ETHTPSDataIntegrationsMSSQLProviderLink[]
	api: ETHTPSApi
}

export function DetailsTab(props: Partial<IDetailsTabProps>): JSX.Element {
	return (
		<>
			<ProviderLinks
				providerLinks={props.providerLinks}
				provider={props.provider}
				api={props.api}
			/>
		</>
	)
}
