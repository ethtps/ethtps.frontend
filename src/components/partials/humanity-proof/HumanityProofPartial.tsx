'use client'
import { createHandlerFromCallback } from '@/data/src'
import { api, getAPIKey, queryClient } from '@/services/DependenciesIOC'
import { ApplicationDataService } from '@/services/flows'
import {
  Box,
  LoadingOverlay,
  Group,
  Progress,
  Card,
  createStyles,
  Text
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { ReactElement, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { setApplicationDataLoaded } from '@/data/src/slices/ApplicationStateSlice'
import { sleep } from '@/services'

const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor: theme.fn.primaryColor()
  },

  title: {
    color: theme.fn.rgba(theme.white, 0.65)
  },

  stats: {
    color: theme.white
  },

  progressBar: {
    backgroundColor: theme.white
  },

  progressTrack: {
    backgroundColor: theme.fn.rgba(theme.white, 0.4)
  }
}))
interface IHumanityProofPartialProps {
  element: ReactElement
  dataLoaded: boolean
}

let loading = false
export default function HumanityProofPartial(
  props: IHumanityProofPartialProps
) {
  const dispatch = useDispatch()
  const [progress, setProgress] = useState<number>(5)
  const [visible, { toggle }] = useDisclosure(
    getAPIKey()?.length === 0 || progress !== 100
  )
  if (props.dataLoaded && visible) {
    toggle()
  }
  const [loadingMessage, setLoadingMessage] = useState('Loading...')
  const progressHandler = createHandlerFromCallback<number>((x) => {
    x ??= 0
    setProgress(x)
    if (x >= 100) {
      dispatch(setApplicationDataLoaded(true))
    }
  })
  const dataService = visible
    ? new ApplicationDataService(api, queryClient, progressHandler)
    : undefined
  const [failureCount, setFailureCount] = useState(0)
  useEffect(() => {
    if (failureCount >= 2) {
      setLoadingMessage('Loading... this is taking a while')
    }
    if (failureCount >= maxFailures) {
      setLoadingMessage('Retrying...')
    }
  }, [failureCount])
  const maxFailures = 5
  let waitTime = 1000
  const loadData = async () => {
    if (!loading && !props.dataLoaded) {
      loading = true
      while (true) {
        try {
          dataService?.loadDataAsync(dispatch)
          break
        } catch {
          setFailureCount(failureCount + 1)
          waitTime *= 2
        } finally {
          await sleep(waitTime)
          if (failureCount >= maxFailures) {
            await sleep(2500)
            location.reload()
          }
        }
      }
    }
  }
  if (dataService) {
    dispatch(setApplicationDataLoaded(false))
    loadData()
  }
  return (
    <>
      <Box w={'100%'} h={'100%'} pos='relative'>
        <LoadingOverlay
          visible={visible}
          overlayBlur={2}
          style={{ width: '100%' }}
          loader={
            <>
              <Card radius='md' p='xl'>
                <Group position='center' style={{ width: '100%' }}>
                  <Progress
                    color='violet'
                    radius='xl'
                    w={'500px'}
                    size={24}
                    value={progress}
                    striped
                    animate
                    label={`${progress <= 5 ? 0 : progress}%`}
                  />
                </Group>
                <Group position='center' style={{ width: '100%' }}>
                  <Text fz='md' fw={700}>
                    {loadingMessage}
                  </Text>
                </Group>
              </Card>
            </>
          }>
          {props.element}
        </LoadingOverlay>
      </Box>
    </>
  )
}
