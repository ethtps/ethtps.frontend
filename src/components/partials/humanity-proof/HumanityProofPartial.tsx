import { useAppState } from '@/services'
import {
  Box,
  LoadingOverlay,
  Group,
  Button,
  Text,
  Progress
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { ReactElement, ReactNode, useState } from 'react'

interface IHumanityProofPartialProps {
  element: ReactElement
}

export default function HumanityProofPartial(
  props: IHumanityProofPartialProps
) {
  const [visible, { toggle }] = useDisclosure(true)
  const [progress, setProgress] = useState(25)
  const isHuman = useAppState().applicationState.hasProvenIsHuman
  return (
    <>
      <Box w={'100%'} h={'100%'} pos="relative">
        <LoadingOverlay
          visible={!isHuman}
          overlayBlur={2}
          style={{ width: '100%' }}
          loader={
            <>
              <Group position="center" style={{ width: '100%' }}>
                <Progress
                  color="violet"
                  radius="xl"
                  w={'500px'}
                  size={24}
                  value={progress < 20 ? 20 : progress}
                  striped
                  animate
                  label="Loading..."
                />
              </Group>
            </>
          }
        >
          {props.element}
        </LoadingOverlay>
      </Box>
    </>
  )
}
