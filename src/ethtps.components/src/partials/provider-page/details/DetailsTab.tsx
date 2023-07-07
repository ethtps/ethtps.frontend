import {
	ETHTPSDataCoreModelsResponseModelsProviderResponseModel,
	ETHTPSDataIntegrationsMSSQLProviderLink,
} from 'ethtps.api'
import { ProviderLinks } from '../../../..'

interface IDetailsTabProps {
	provider: ETHTPSDataCoreModelsResponseModelsProviderResponseModel
	providerLinks?: ETHTPSDataIntegrationsMSSQLProviderLink[]
}

export function DetailsTab(props: Partial<IDetailsTabProps>): JSX.Element {
	return (
		<>
			<ProviderLinks
				providerLinks={props.providerLinks}
				provider={props.provider}
			/>
		</>
	)
}
