import React from 'react'
import { CustomButtonGroup } from './groups'

export function ModeButton(): JSX.Element {
  return (
    <>
      <CustomButtonGroup {...{ buttons: ['TPS', 'GPS', 'GTPS'] }} />
    </>
  )
}
