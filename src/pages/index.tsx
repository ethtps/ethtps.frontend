import HumanityProofPartial from '@/components/partials/humanity-proof/HumanityProofPartial'
import { AllProvidersTable } from '@/components/tables'
import { ProviderResponseModel, useGetProvidersFromAppStore } from '@/data/src'
import { useGetMaxDataFromAppStore } from '@/data/src/hooks/DataHooks'
import { Group, Paper } from '@mantine/core'

export default function Home() {
  const providers = useGetProvidersFromAppStore()
  const maxData = useGetMaxDataFromAppStore()
  return (
    <>
      <Paper>hello</Paper>
      <Paper>
        <AllProvidersTable
          providerData={providers}
          maxRowsBeforeShowingExpand={15}
          maxData={maxData}
        />
      </Paper>
    </>
  )
}
