//import { api } from '@/services/DependenciesIOC'

export function generateStaticParams() {
  console.log('Calling GET slugs')
  // const slugs = await api.getslugsAsync()
  return [
    {
      name: 'ethereum'
    }
  ].map((x) => ({
    slug: x.name
  }))
}

export default function Page({ params }: { params: { slug: string } }) {
  return <>Provider: {JSON.stringify(params)}</>
}
