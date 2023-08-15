import { Alert, Box, Button, Container, Divider, Stack } from "@chakra-ui/react"
import { useState } from "react"
import { conditionalRender } from "../../.."

interface ISimpleAPIActionButtonProps<T> {
    title?: string,
    description?: string,
    buttonIcon: JSX.Element,
    body?: JSX.Element,
    buttonColor?: string
    pendingMessage: string,
    buttonMessage: string,
    actionSeverity: 'success' | 'info' | 'warning' | 'error',
    action?: () => Promise<T>
    disabled?: boolean,
    sx?: any,
    generateSuccessMessage: (result: T) => string,
}

export function SimpleAPIActionButton<T>(props: ISimpleAPIActionButtonProps<T>) {
    const [actionResult, setActionResult] = useState<string>('')
    const onClick = () => {
        setActionResult(props.pendingMessage)
        props.action?.()
            .then(res => {
                setActionResult(props.generateSuccessMessage(res))
            })
            .catch(err => {
                setActionResult(`Error: ${err}`)
            })
    }
    return <>
        <Box sx={{
            width: '100%',
        }} alignContent={'initial'}>
            <Container sx={{
                padding: '1rem',
                paddingTop: 0,
                width: '100%',
            }}>
                <h2>{props.title}</h2>
                <Stack dir={'row'} alignItems={'center'} spacing={2}>
                    {props.body ?? conditionalRender(<Alert security={props.actionSeverity}>{props.description}</Alert>, props.description !== undefined)}
                    <Button
                        disabled={actionResult === props.pendingMessage || props.disabled}
                        onClick={onClick}
                        size="medium"
                        rightIcon={props.buttonIcon}
                        sx={{
                            ...props.sx,
                            width: props.sx?.width ?? '8rem',
                            backgroundColor: props.buttonColor,
                            fontWeight: 'bold',
                            color: 'white',
                            ":hover": {
                                backgroundColor: 'darkred',
                                color: 'white',
                            },
                            ":disabled": {
                                opacity: 0.1
                            }
                        }}>
                        {props.buttonMessage}
                    </Button>
                </Stack>
                {conditionalRender(<>
                    <Divider sx={{
                        marginTop: '1rem',
                        opacity: 0
                    }} />
                    <Alert security={actionResult.startsWith('Error') ? 'error' : actionResult.startsWith('Deleting') ? 'info' : 'success'}>{actionResult}</Alert>
                </>, actionResult !== '')}
            </Container>
        </Box>
    </>
}