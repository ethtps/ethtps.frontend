import { ETHTPSDataCoreModelsResponseModelsAPIKeyAPIKeyResponseModel } from 'ethtps.api'
import { useCallback, useEffect, useState } from 'react'
import {
	GoogleReCaptcha,
	GoogleReCaptchaProvider,
} from 'react-google-recaptcha-v3'
import { FullScreenLoadingAnimation, conditionalRender, useQueryStringAndLocalStorageBoundState } from '../../..'
import NonSSRWrapper from '../../NonSSRWrapper'
import { useLastVisitTime } from '../../hooks/VisitorHooks'
import { getKeyAsync, useExistingKeyValidator } from './Hooks'

const animationDuration = 2500

export function RecaptchaTokenLoader(props: {
	onKeyLoaded?: (key: string) => void
	onIsHuman?: (isHuman: boolean) => void
	apiEndpoint: string
	apiKeyGetter?: (humanityToken: string) => Promise<ETHTPSDataCoreModelsResponseModelsAPIKeyAPIKeyResponseModel>
}): JSX.Element {
	const [text, setText] = useState<string>("Loading...")
	const [key, setKey] = useQueryStringAndLocalStorageBoundState<string | undefined>(undefined, 'apiKey')
	const keyValid = useExistingKeyValidator(key, props.apiEndpoint)
	const [ready, setReady] = useState(keyValid)
	const lastVisitTime = useLastVisitTime() //Only stored locally, don't render recaptcha if it's been less than 2 days since last visit
	useEffect(() => {
		setText("Welcome!")
		setTimeout(() => {
			props.onIsHuman?.(keyValid)
			setReady(true)
		}, animationDuration)
	}, [keyValid])
	const handleHumanArrived = (token: string) => {
		getKeyAsync(props.apiEndpoint, token)?.then((res) => {
			setKey(res?.key!)
		}).catch((r) => {
			console.log(r)
			handlePossiblyABeepBoop()
		})
		setTimeout(() => {
			setReady(true)
		}, animationDuration)
		setTimeout(() => {
			setText('Please wait...')
		}, animationDuration * 2)
		setTimeout(() => {
			setText('This is taking longer than expected... :/')
		}, animationDuration * 4)
		setTimeout(() => {
			setText('Reloading...')
			setTimeout(() => {
				if (typeof window !== 'undefined' && !ready) {
					window.location.reload()
				}
			}, 30000)
		}, animationDuration * 6)
	}
	const handlePossiblyABeepBoop = () => {
		props.onIsHuman?.(false)
		setText('Are you a robot?')
	}
	const loader = useCallback(() => (<>
		<>
			{conditionalRender(<GoogleReCaptchaProvider
				reCaptchaKey={'6Le_XTUkAAAAAJKXCh8Cvq6UFvokPtjfTLCp1JAP'}>
				<div>
					<GoogleReCaptcha onVerify={handleHumanArrived} />
				</div>
			</GoogleReCaptchaProvider>, !ready)}
		</>
	</>), [])
	return (
		// We only use recaptcha for getting an API key, if the user comes back later we won't let google know that. This has to run only on the client side.
		// We also don't want to render the recaptcha if it's been less than 2 days since the user last visited the site, the api key should still be valid
		<>
			<FullScreenLoadingAnimation durationSeconds={animationDuration / 1000} text={''} />
			{loader()}
		</>
	)
}
