import { Fragment } from 'react'
import { ILoadingProp } from '../../interfaces/ILoadingProp'
import { Skeleton } from '@mantine/core'
export function LoadingElementSkeleton(props: {
  children: React.ReactNode
  loading?: ILoadingProp
}) {
  if (props.loading.loading)
    return (
      <Fragment>
        <Skeleton visible></Skeleton>
      </Fragment>
    )
  else return <Fragment>{props.children}</Fragment>
}
