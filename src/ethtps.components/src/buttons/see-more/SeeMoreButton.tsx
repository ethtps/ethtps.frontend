import { useState } from 'react'
import { ISeeMoreButtonProps } from './ISeeMoreButtonProps'
import React from 'react'
import { Button } from '@chakra-ui/react'
import { IconArrowDown, IconArrowUp } from '@tabler/icons-react'

export function SeeMoreButton(events: ISeeMoreButtonProps) {
  const [expand, setExpand] = useState(true)
  const onClick = () => {
    if (expand) {
      if (events.onSeeMore !== undefined) {
        events.onSeeMore()
      }
    } else {
      if (events.onSeeLess !== undefined) {
        events.onSeeLess()
      }
    }
    setExpand(!expand)
  }
  const getIcon = () => (expand ? <IconArrowDown /> : <IconArrowUp />)
  return (
    <>
      <Button
        disabled={!events.enabled}
        variant='text'
        sx={{
          width: '100%'
        }}
        onClick={() => onClick()}>
        See {expand ? 'more' : 'less'}
      </Button>
    </>
  )
}
