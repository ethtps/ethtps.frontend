import { withRouter } from 'next/router'
import { Fragment, useState } from 'react'
import { IWithRouter } from '../interfaces/IWithRouter'
import { Container, Paper } from '@mantine/core'
import { LoadingElementSkeleton } from '../components/skeleton/LoadingElementSkeleton'
import { useHandler, createHandlerFromCallback } from 'ethtps.data'
import { Streamgraph } from '../components/streamgraph/Streamgraph'

const MainPage = (props: IWithRouter) => {
  const [streamgraphLoading, setStreamgraphLoading] = useState(true)
  const streamgraphHandler = createHandlerFromCallback((v: boolean) =>
    setStreamgraphLoading(v)
  )
  const streamgraph = useHandler<boolean>(
    streamgraphHandler.convertToIHandler()
  )
  return (
    <Fragment>
      <Container size={'lg'}>
        <Paper shadow="xs">
          <LoadingElementSkeleton
            children={<Streamgraph loadingHandler={streamgraph} />}
            loading={{ loading: streamgraphLoading }}
          />
        </Paper>
      </Container>
    </Fragment>
  )
}

export default withRouter(MainPage)
