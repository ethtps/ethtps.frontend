import {
  AllProvidersTable,
  LivePSPartial,
  DataOverviewChart
} from '@/components'
import { useGetMaxDataFromAppStore, useGetProvidersFromAppStore } from '@/data'
import { Grid, Paper } from '@mantine/core'
import { useEffect, useRef, useState } from 'react'

export default function Home() {
  const providers = useGetProvidersFromAppStore()
  const maxData = useGetMaxDataFromAppStore()

  const [containerWidth, setContainerWidth] = useState(0)
  const containerRef = useRef<any>(null)
  useEffect(() => {
    setContainerWidth(
      containerRef.current ? containerRef.current.offsetWidth : 0
    )
  }, [containerRef])
  return (
    <>
      <Grid>
        <Grid.Col span={2}></Grid.Col>
        <Grid.Col span={'auto'}>
          <Paper
            sx={{
              height: 400,
              border: '1px solid red'
            }}>
            <LivePSPartial width={containerWidth} />
          </Paper>
          <Paper ref={containerRef}>
            <AllProvidersTable
              width={containerWidth}
              providerData={providers}
              maxRowsBeforeShowingExpand={15}
              maxData={maxData}
            />
          </Paper>{' '}
          <Paper
            sx={{
              height: 400,
              border: '1px solid red'
            }}>
            <DataOverviewChart width={containerWidth} />
          </Paper>
        </Grid.Col>
        <Grid.Col span={2}></Grid.Col>
      </Grid>
    </>
  )
}
