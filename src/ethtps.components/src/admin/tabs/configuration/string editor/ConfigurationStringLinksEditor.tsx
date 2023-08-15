import { Accordion, AccordionItem, AccordionPanel, Alert, Box, Button, Checkbox, Divider, FormControl, FormLabel, Grid, Input, Progress, Stack, Text } from "@chakra-ui/react"
import { ETHTPSConfigurationDatabaseConfigurationString } from "ethtps.admin.api"
import { useCallback, useEffect, useState } from "react"
import { IConfigurationStringLinksEditorProps, useMicroserviceBadges, useProviderBadges } from ".."
import { binaryConditionalRender } from "../../../../.."

export function ConfigurationStringLinksEditor(props: IConfigurationStringLinksEditorProps) {
    const [name, setName] = useState<string>()
    const [value, setValue] = useState<string>()
    const [isPassword, setIsPassword] = useState<boolean>()
    const [isSecret, setIsSecret] = useState<boolean>()
    const [isEncrypted, setIsEncrypted] = useState<boolean>()
    const [expanded, setExpanded] = useState<string | boolean>(true)

    const handleChange = useCallback((panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
        setExpanded(prev => !prev) // Toggle expanded status on click
    }, [])

    useEffect(() => {
        if (!props.model.configurationString?.isSecret) return
        setIsSecret(!!props.model.configurationString?.isSecret)
    }, [props.model.configurationString?.isSecret])

    useEffect(() => {
        setIsEncrypted(!!props.model.configurationString?.isEncrypted)
    }, [props.model.configurationString?.isEncrypted])

    useEffect(() => {
        if (!props.model.configurationString?.name) return
        setName(props.model.configurationString?.name)
    }, [props.model.configurationString?.name])

    useEffect(() => {
        if (!props.model.configurationString?.value) return
        setValue(props.model.configurationString?.value)
    }, [props.model.configurationString?.value])

    useEffect(() => {
        setIsPassword((!!isEncrypted || !!isSecret) || false)
    }, [isEncrypted, isSecret])

    const handleSave = useCallback(() => {
        const data: ETHTPSConfigurationDatabaseConfigurationString = {
            id: props.model.configurationString?.id ?? -1,
            name: name ?? '',
            value: value ?? '',
            isSecret: isSecret,
            isEncrypted: isEncrypted
        }
        props.onSave && props.onSave(data)
    }, [name, value, isSecret, isEncrypted, props])

    const getMicroserviceBadges = useMicroserviceBadges(props)
    const getProviderBadges = useProviderBadges(props)

    return <>
        <Accordion
            onChange={() => handleChange('panel1')}>
            <AccordionItem
                sx={{
                    backgroundColor: 'primary.',
                }} aria-controls="panel1d-content" id="panel1d-header">
                <Grid>
                    <Button
                        variant={'text'}
                        size="large"
                        leftIcon={<></>} sx={{
                            opacity: 1,
                            textTransform: 'none',
                            fontWeight: 'bold',
                            color: 'primary.contrastText',
                        }} disabled>
                        {binaryConditionalRender(<Text>Modify <b>{name}</b></Text>, <Text>Create new</Text>, !!name)}
                    </Button>
                    <Text variant={'subtitle2'}>Click to {expanded ? 'hide' : 'show'}</Text>
                </Grid>
                <AccordionPanel>
                    <Stack spacing={2}>
                        <Text>
                            Basic
                        </Text>
                        <Divider sx={{
                            marginTop: '1rem',
                            marginBottom: '1rem'
                        }} />
                        <Input title="Name" color="secondary" type="text" required value={name} onChange={(e) => setName(e.target.value)} />
                        <Input title="Value" multiple={!isPassword} color="secondary" type={!!isPassword ? 'password' : 'text'} required value={value} onChange={(e) => setValue(e.target.value)} />
                        <Box sx={{ flexGrow: 1 }}>
                            <FormControl >
                                <FormLabel title="Is secret" >
                                    <Checkbox checked={!!isSecret} />
                                </FormLabel>
                                <FormLabel title="Is encrypted">
                                    <Checkbox checked={!!isEncrypted} />
                                </FormLabel>
                            </FormControl>
                            <Grid alignItems={'center'} justifyContent={'flex-end'} >
                                <Divider />
                                <Stack dir={'row'} alignItems={'center'} spacing={1}>
                                    {binaryConditionalRender(props.saveResult, <Divider />)}
                                    <Button
                                        sx={{
                                            width: '3.2rem',
                                            height: '3rem',
                                        }}
                                        onClick={handleSave} disabled={props.saving} variant={'outlined'}>
                                        {props.saving ? (
                                            <Progress
                                                sx={{
                                                    width: '100%',
                                                    color: 'secondary.main'
                                                }}
                                                variant={'indeterminate'}
                                            />
                                        ) : 'Save'}
                                    </Button>
                                </Stack>
                            </Grid>
                        </Box>

                        <Box>
                            <Divider sx={{
                                marginTop: '1rem',
                                marginBottom: '1rem'
                            }} />
                            <Text >
                                Provider bindings
                            </Text>
                            <Divider sx={{
                                marginTop: '1rem',
                                opacity: 0
                            }} />
                            <Alert security="info">
                                <Text>Click on a provider in the list below to link/unlink <b>{name}</b> to/from it. Changes are saved automatically.</Text>
                            </Alert>
                            <Divider sx={{
                                marginTop: '1rem',
                                opacity: 0
                            }} />
                            <Grid dir={'row'} alignContent={'center'} justifyContent={'center'} alignItems={'flex-start'} >
                                {getProviderBadges().map((x, i) => <Grid key={i}>
                                    {x}
                                </Grid>)}
                            </Grid>
                            <Divider sx={{
                                marginTop: '1rem',
                                opacity: 0
                            }} />
                            {props.providerSaveResult}
                        </Box>
                        <Box>
                            <Divider sx={{
                                marginTop: '1rem',
                                marginBottom: '1rem'
                            }} />
                            <Text >
                                Microservice-environment bindings
                            </Text>
                            <Divider sx={{
                                marginTop: '1rem',
                                opacity: 0
                            }} />
                            <Alert security="info">
                                <Text >In order to make everything as customizeable as possible, you can also bind a string to a specific microservice on a specific environment </Text>
                            </Alert>
                            <Divider sx={{
                                marginTop: '1rem',
                                opacity: 0
                            }} />
                            {getMicroserviceBadges()}
                        </Box>
                    </Stack>
                </AccordionPanel>
            </AccordionItem>
        </Accordion >
    </>
}