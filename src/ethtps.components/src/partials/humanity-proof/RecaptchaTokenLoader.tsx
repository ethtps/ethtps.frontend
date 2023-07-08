import { createRef, useState } from 'react'
import {
	GoogleReCaptcha,
	GoogleReCaptchaProvider,
} from 'react-google-recaptcha-v3'
import { FullScreenLoadingAnimation, conditionalRender, useQueryStringAndLocalStorageBoundState } from '../../..'
import { IHandler, useHandler } from '../../../../ethtps.data/src'
import NonSSRWrapper from '../../NonSSRWrapper'

const animationDuration = 2500

export function RecaptchaTokenLoader(props: {
	onKeyLoaded?: IHandler<string>
	onIsHuman?: IHandler<boolean>
}): JSX.Element {
	const [animationEnded, setAnimationEnded] = useState(false)
	const keyLoaded = useHandler(props.onKeyLoaded)
	const isHuman = useHandler(props.onIsHuman)
	const [key, setKey] = useQueryStringAndLocalStorageBoundState<string | undefined>(undefined, 'apiKey')
	const [ready, setReady] = useState(key && key?.length !== 0)
	const refRecaptcha = createRef<any>()
	const handleHumanArrived = (token: string) => {
		if (keyLoaded?.callback) {
			keyLoaded?.callback(token)
			if (isHuman?.callback) isHuman?.setter(true)
		}
		setText('Welcome!')
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
			setText('Try reloading the page')
		}, animationDuration * 6)
	}
	const handlePossiblyABeepBoop = () => {
		if (isHuman?.callback) isHuman?.setter(false)
		setText('Are you a robot?')
	}

	const [text, setText] = useState<string>(" ")
	if (!ready) {
		setTimeout(() => {
			if (text !== 'Welcome!') {
				setText('Loading...')
			}
		}, animationDuration)
	}
	else {
		if (text == 'Welcome!') {
			setTimeout(() => {
				setText('')
				setAnimationEnded(true)
			}, animationDuration)
		}
	}
	return (
		// We only use recaptcha for getting an API key, if the user comes back later we won't let google know that. This has to run only on the client side.
		<>
			<NonSSRWrapper>
				<FullScreenLoadingAnimation durationSeconds={animationDuration / 1000} text={text} />
				{conditionalRender(
					<>
						<GoogleReCaptchaProvider
							reCaptchaKey={'6Le_XTUkAAAAAJKXCh8Cvq6UFvokPtjfTLCp1JAP'}>
							<div>
								<GoogleReCaptcha
									onVerify={handleHumanArrived}
								/>
							</div>
						</GoogleReCaptchaProvider>
					</>,
					!ready && !animationEnded
				)}
			</NonSSRWrapper>
		</>
	)
}
