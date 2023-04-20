import React from 'react'
import { CustomButtonGroup } from './groups'

export function ModeButton(): JSX.Element {
  return (
    <React.Fragment>
      <CustomButtonGroup {...{ buttons: ['TPS', 'GPS', 'GTPS'] }} />
    </React.Fragment>
  )
}
