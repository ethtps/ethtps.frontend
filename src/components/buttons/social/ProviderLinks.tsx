import { ExternalWebsiteCategory, IExternalWebsite, IProviderExternalWebsite, ProviderLink, ProviderResponseModel } from "@/api-client"
import { TryAgainLink } from "@/components"
import { groupBy } from "@/data"
import { api, binaryConditionalRender, conditionalRender, useColors } from "@/services"
import { Box, Card, CardBody, CardHeader, Divider, Heading, Skeleton, Stack, Text } from "@chakra-ui/react"
import { Dictionary } from "@reduxjs/toolkit"
import { useEffect, useState } from "react"

interface IProviderLinksProps {
    provider: ProviderResponseModel
    providerLinks?: ProviderLink[]
}

const createLinks = (providerLinks?: ProviderLink[], websites?: IProviderExternalWebsite[]) => {
}
/* Cases:
1 - Loading (&& no error) (x)
2 - Error (x)
3 - No links
4 - Ok
*/
export function ProviderLinks(props: Partial<IProviderLinksProps>) {
    const colors = useColors()
    const [loadedWebsites, setLoadedWebsites] = useState<boolean>(false)
    const [loadedWebsiteCategories, setLoadedWebsiteCategories] = useState<boolean>(false)
    const [hasError, setHasError] = useState<boolean>(false)
    const [websites, setWebsites] = useState<Dictionary<IExternalWebsite[]>>()
    const [categories, setCategories] = useState<ExternalWebsiteCategory[]>()
    useEffect(() => {
        api.getAllExternalWebsites().then((response) => {
            const value = response.filter(x => props.providerLinks?.find(y => y.externalWebsiteId === x.id))
            setWebsites(groupBy(value, x => (x.category ?? -1).toString()))
            setLoadedWebsites(true)
        }).catch(() => setHasError(true))
    }, [props.providerLinks, api])

    useEffect(() => {
        api.getAllExternalWebsiteCategories().then((response) => {
            setCategories(response)
            setLoadedWebsiteCategories(true)
        }).catch(() => setHasError(true))
    }, [websites, api])

    return <>
        <Card>
            <Skeleton fadeDuration={2} isLoaded={(loadedWebsites && loadedWebsiteCategories) || hasError} width='100%' >
                <CardHeader>
                    <Heading size='md'>Useful references for {props.provider?.name}</Heading>
                </CardHeader>
            </Skeleton>
            <CardBody>
                <Stack spacing='4'>
                    <Skeleton fadeDuration={3} isLoaded={(loadedWebsites && loadedWebsiteCategories) || hasError} width='100%' >
                        {binaryConditionalRender(<>
                            {conditionalRender(<>
                                {Object.keys(websites ?? {}).map((key, index) => {
                                    const categoryID = parseInt(key)
                                    const category = categories?.find(z => z.id === categoryID)
                                    return <>
                                        {conditionalRender(<Divider sx={{
                                            marginTop: '1rem',
                                            marginBottom: '1rem'
                                        }} />, (index > 0))}
                                        <Box key={`${category?.name}${index}`}>
                                            <Heading size='xs' textTransform='uppercase'>{category?.name}</Heading>
                                            <>
                                                {websites?.[key]?.map((website, index) => {
                                                    return <Text key={index}>{website.name}</Text>
                                                })}
                                            </>
                                        </Box>
                                    </>
                                })}
                            </>, (categories?.length ?? 0) > 0)}
                        </>, <>
                            <TryAgainLink />
                        </>, !hasError)}
                    </Skeleton>
                </Stack>
            </CardBody>
        </Card>
    </>
}