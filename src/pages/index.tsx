import CustomVISXStreamgraph from '@/components/instant data animations/CustomVISXStreamgraph'
import HumanityProofPartial from '@/components/partials/humanity-proof/HumanityProofPartial'
import { AllProvidersTable } from '@/components/tables'
import { ProviderResponseModel, useGetProvidersFromAppStore } from '@/data/src'
import { useGetMaxDataFromAppStore } from '@/data/src/hooks/DataHooks'
import { Grid, Group, Paper } from '@mantine/core'
import { useState, useRef, useEffect } from 'react'

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
          <Paper ref={containerRef}>
            <CustomVISXStreamgraph width={containerWidth} height={500} />
          </Paper>
          <Paper>
            <AllProvidersTable
              providerData={providers}
              maxRowsBeforeShowingExpand={15}
              maxData={maxData}
            />
          </Paper>
        </Grid.Col>
        <Grid.Col span={2}></Grid.Col>
      </Grid>
    </>
  )
}
