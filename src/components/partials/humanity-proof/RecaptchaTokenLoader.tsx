import { IHandler, useHandler, useAppState } from '@/data'
import { conditionalRender } from '@/services'
import React from 'react'
import { createRef } from 'react'
import { useState } from 'react'
import {
  GoogleReCaptcha,
  GoogleReCaptchaProvider
} from 'react-google-recaptcha-v3'

export function RecaptchaTokenLoader(props: {
  onKeyLoaded?: IHandler<string>
  onIsHuman?: IHandler<boolean>
}) {
  const keyLoaded = useHandler(props.onKeyLoaded)
  const isHuman = useHandler(props.onIsHuman)

  const [ready, setReady] = useState<boolean>(
    useAppState().applicationState.apiKey !== undefined || false
  )
  const refRecaptcha = createRef<any>()
  const handleHumanArrived = () => {
    const tokenData: any = refRecaptcha.current?.callbacks.getResponse()
    if (keyLoaded?.callback) {
      keyLoaded?.callback(tokenData)
      if (isHuman?.callback) isHuman?.setter(true)
    }
    setReady(true)
  }
  const handlePossiblyABeepBoop = () => {
    if (isHuman?.callback) isHuman?.setter(false)
  }
  return (
    //We use recaptcha only for getting an API key, if the user comes back later we don't let google know that
    <React.Fragment>
      {conditionalRender(
        <GoogleReCaptchaProvider
          reCaptchaKey={'6Le_XTUkAAAAAJKXCh8Cvq6UFvokPtjfTLCp1JAP'}>
          <div>
            <GoogleReCaptcha
              onVerify={(x) => {
                console.log(x)
                if (keyLoaded?.callback) {
                  keyLoaded?.callback(x)
                }
              }}
            />
          </div>
        </GoogleReCaptchaProvider>,
        !ready
      )}
    </React.Fragment>
  )
}
