import { ETHTPSDataCoreDataType } from 'ethtps.api'
import { CustomButtonGroup } from './groups'

export function ModeButton(): JSX.Element {
  return (
    <>
      <CustomButtonGroup {...{ buttons: [ETHTPSDataCoreDataType.TPS, ETHTPSDataCoreDataType.GPS, 'GTPS'] }} />
    </>
  )
}
