import React, { useState, useEffect } from "react"
import {
    Button, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader,
    AlertDialogCloseButton, AlertDialogBody, AlertDialogFooter, Text,
    Input, Stack, Textarea
} from "@chakra-ui/react"
import { useColors } from "@/services"

interface IDataIssueDialogDialogProps {
    isOpen: boolean
    onClose: () => void
}

export function DataIssueDialog(props: IDataIssueDialogDialogProps) {
    const colors = useColors()
    const { isOpen, onClose } = props
    const cancelRef = React.useRef<any>(null)

    const [description, setDescription] = useState('')
    const [descriptionValid, setDescriptionValid] = useState(false)

    const [submitEnabled, setSubmitEnabled] = useState(false)

    useEffect(() => {
        const validateInput = () => {
            let isValid = true
            if (!description) {
                isValid = false
                setDescriptionValid(false)
            }

            setSubmitEnabled(isValid)
        }

        validateInput()
    }, [description, descriptionValid])

    const handleClose = () => {
        onClose()
    }

    return (
        <AlertDialog
            motionPreset='slideInBottom'
            leastDestructiveRef={cancelRef}
            onClose={handleClose}
            isOpen={isOpen}
            isCentered
        >
            <AlertDialogOverlay />
            <AlertDialogContent>
                <AlertDialogHeader>Report an issue</AlertDialogHeader>
                <AlertDialogCloseButton />
                <AlertDialogBody>
                    <Stack spacing={3}>
                        <Text color={colors.text} fontSize='md'>Is there something wrong with the data displayed on this page?</Text>
                        <Textarea
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder='Describe the issue' />
                    </Stack>
                </AlertDialogBody>
                <AlertDialogFooter>
                    <Button ref={cancelRef} onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button isDisabled={!submitEnabled} colorScheme='green' ml={3}>
                        Submit
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
