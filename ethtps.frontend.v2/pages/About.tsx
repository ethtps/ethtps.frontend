import { Fragment } from 'react'
import { withRouter } from 'next/router'
import { IWithRouter } from '../interfaces/IWithRouter'

const AboutPage = (props: IWithRouter) => {
  return (
    <Fragment>
      About page
      {props.router.pathname}
    </Fragment>
  )
}

export default withRouter(AboutPage)
