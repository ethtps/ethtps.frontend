
import { Alert, Box, Checkbox, Container, Divider, FormControl, FormLabel, Text } from "@chakra-ui/react"

import { useEffect, useState } from "react"
import { SimpleAPIActionButton } from "../../../.."

const exportableSchemas = [
    "dbo",
    "Security",
    "ABTesting",
    "ProjectManagement",
    "Info",
    "Configuration",
    "Microservices",
    "Logging",
    "DataUpdaters",
    "Statistics",
    "Feedback"
] // will be replaced with a call to the API eventually

export function InsertGenerator() {
    const [checkDict, setCheckDict] = useState<{ [key: string]: boolean }>()
    const [buttonsDisabled, setButtonsDisabled] = useState<boolean>(false)
    const [selected, setSelected] = useState<string[]>()
    const [disableCheckboxes, setDisableCheckboxes] = useState<boolean>(false)
    useEffect(() => {
        setCheckDict(exportableSchemas.reduce((acc, curr) => ({ ...acc, [curr]: false }), {}))
    }, [])
    useEffect(() => {
        const items = Object.values(checkDict ?? {})
        setButtonsDisabled(items.every(v => !v))
        setSelected(Object.keys(checkDict ?? {}).filter(k => checkDict?.[k] ?? false))
    }, [checkDict])
    return <> <Divider sx={{ margin: 1 }} />
        <Container sx={{ padding: '1rem', paddingTop: 0, width: '100%' }}>
            <h2 >Database dump</h2>
            <Box>
                <Alert security="info">Generates SQL insert scripts</Alert>
                <Divider sx={{ margin: 1 }} />
                <Alert security="warning">Warning: may expose sensitive data</Alert>
                <Divider sx={{ margin: 1 }} />
                <Text >Choose one or more schemas from the following list:</Text>
                <Divider sx={{ margin: 1 }} />
                <Container>
                    <FormControl sx={{
                        maxHeight: '20rem',
                    }}>
                        {exportableSchemas.map(schema =>
                            <FormLabel key={schema}
                                title={`[${schema}]`}>
                                <Checkbox
                                    disabled={disableCheckboxes}
                                    checked={checkDict?.[schema] ?? false} onChange={(e) =>
                                        setCheckDict({ ...checkDict, [schema]: e.target.checked })} />
                            </FormLabel>)}
                    </FormControl>
                    <Divider sx={{ margin: 1 }} />
                    <SimpleAPIActionButton<string>
                        disabled={buttonsDisabled}
                        buttonIcon={<></>}
                        pendingMessage={'Generating scripts...'}
                        buttonMessage={`${selected?.length === 1 ? selected.at(0) + '.sql' : `Download (${selected?.length} files)`}`} actionSeverity={'info'}
                        buttonColor={'darkblue'}
                        sx={{
                            width: '20rem',
                            'textTransform': 'none',
                        }}
                        generateSuccessMessage={(result) => { return result }} />
                    <Divider sx={{ margin: 1 }} />
                    <Box>
                        <Text variant={'h6'} >Options:</Text>
                        <FormControl sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}>
                            <FormLabel
                                title={'Options:'} >
                                <Checkbox disabled={disableCheckboxes} />
                            </FormLabel>

                        </FormControl>
                    </Box>
                </Container>
            </Box>
        </Container>
    </>
}