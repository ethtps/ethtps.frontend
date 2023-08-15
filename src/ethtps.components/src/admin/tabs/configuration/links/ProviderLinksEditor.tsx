
import { Button, Divider, Input, Stack, Text } from "@chakra-ui/react"
import { ETHTPSDataCoreModelsResponseModelsProviderResponseModel } from "ethtps.api"
import { useContext, useState } from "react"
import { APIContext } from "../../../.."
import { conditionalRender } from "../../../../.."
import { CustomDropdown } from "../../../CustomDropdown"
import { useExternalWebsites } from "../websites/Hooks"

interface IProviderLinksEditorProps {
    providers: ETHTPSDataCoreModelsResponseModelsProviderResponseModel[]
    onAdded: (link: string, providerID: number) => void
}
export function ProviderLinksEditor(props: Partial<IProviderLinksEditorProps>) {
    const api = useContext(APIContext)
    const loadedWebsites = useExternalWebsites()
    const [selectedProvider, setSelectedProvider] = useState(props.providers?.[0])
    const [adding, setAdding] = useState(false)
    const [url, setUrl] = useState('')
    const [result, setResult] = useState<string | undefined>()
    const onAdd = () => {
        setAdding(true)
        api.createProviderLinkAsync(selectedProvider?.id ?? -1, url).then(x => {
            setResult("Added " + url)
            setUrl('')
            props.onAdded?.(url, selectedProvider?.id ?? -1)
        }).catch(x => {
            setResult("Error: " + x?.response?.data?.message ?? "Unknown error")
        }).finally(() => {
            setAdding(false)
        })
    }
    return <>
        <Text >Quick add</Text>
        <Text >Use this editor to quickly add links to a provider. These will be displayed in the details page. Please make sure to double-check the website's category after adding a website.</Text>
        <Divider sx={{
            marginTop: '1rem',
            marginBottom: '1rem',
        }} />
        <Stack dir={'column'}>
            <Text >Choose provider</Text>
            <CustomDropdown<ETHTPSDataCoreModelsResponseModelsProviderResponseModel>
                displayedKey={'name'}
                options={props.providers ?? []}
                selectedOption={selectedProvider}
                onChange={setSelectedProvider}
            />
            <Divider sx={{
                marginTop: '1rem',
                marginBottom: '1rem',
            }} />
            <Text >URL</Text>
            <Input onChange={x => setUrl(x.target.value)} type="URL" value={url} placeholder="http://" />
            <Divider sx={{
                marginTop: '1rem',
                marginBottom: '1rem',
            }} />
            <Button onClick={onAdd} disabled={!(!!selectedProvider && url?.length > 0 && !adding)} variant="contained">Add</Button>
            {conditionalRender(<Text>{result}</Text>, (result?.length ?? 0) > 0)}
            <Divider sx={{
                marginTop: '1rem',
                marginBottom: '1rem',
            }} />
        </Stack>
        <Divider sx={{
            marginTop: '1rem',
        }} />
    </>
}