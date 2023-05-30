import { Code, Heading, Image, Text } from "@chakra-ui/react"
// eslint-disable-next-line import/no-internal-modules
import { MergeComponents, Components } from "@mdx-js/react/lib"

export const components = {
  h1: (props: any) => <>
    <Heading sx={{
      marginTop: '1rem',
      marginBottom: '1rem'
    }} as="h1" size="xl" {...props} />
  </>,
  h2: (props: any) => <Heading as="h2" size="lg" {...props} />,
  h3: (props: any) => <Heading as="h3" size="md" {...props} />,
  h4: (props: any) => <Heading as="h4" size="sm" {...props} />,
  h5: (props: any) => <Heading as="h5" size="xs" {...props} />,
  p: (props: any) => <Text as="p" {...props} />,
  img: (props: any) => <Image alt={'markdown image'} {...props} />,
} 
