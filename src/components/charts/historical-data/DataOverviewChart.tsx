import { IComponentSize } from '@/components'

interface Test extends IComponentSize {
  stars?: any
}

export function DataOverviewChart(props: Test) {
  return <>Placeholder for data overview chart {props.stars}</>
}

export async function getStaticProps(ctx: any) {
  console.log('fetching')
  const res = await fetch('https://api.github.com/repos/vercel/next.js')
  const json = await res.json()
  return { props: { stars: json.stargazers_count } as Test }
}

export const config = {
  runtime: 'experimental-edge'
}
