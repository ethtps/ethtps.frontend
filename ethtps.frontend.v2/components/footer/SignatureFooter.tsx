import React from 'react'

export function SignatureFooter(): JSX.Element {
  return (
    <React.Fragment>
      <div className={'inline'}>
        Brought to you by
        <div style={{ marginLeft: '5px' }} className={'trick'}>
          <span>Mister_Eth</span>
        </div>
        <br></br>
        Donate:
        <a
          style={{ marginLeft: '5px' }}
          href="https://app.ens.domains/name/ethtps.eth/details"
        >
          ethtps.eth
        </a>
        <p className={'ul-hover inline'} style={{ marginLeft: '5px' }}>
          (0x466Ef24d68ac9b61670eeE7fC2E001B951aBf482)
        </p>
      </div>
    </React.Fragment>
  )
}
