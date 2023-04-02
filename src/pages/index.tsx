import HumanityProofPartial from '@/components/partials/humanity-proof/HumanityProofPartial'
import { ProviderTable } from '@/components/tables'
import { useAppState } from '@/services/data/Hooks'
import { Group, Paper } from '@mantine/core'

export default function Home() {
  return (
    <>
      <Paper>hello</Paper>
      <Paper>
        <ProviderTable />
      </Paper>
    </>
  )
}
