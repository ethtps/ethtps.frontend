import {
	AlertDialog,
	AlertDialogBody,
	AlertDialogCloseButton,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogOverlay,
	Button,
	Stack,
	Text,
	Textarea,
	useToast,
} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { conditionalRender, useColors } from '..'
import { ETHTPSApi } from '../../../ethtps.data/src'

interface IDataIssueDialogDialogProps {
	isOpen: boolean
	onClose: () => void
	api: ETHTPSApi
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
			if (description?.length < 10) {
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
	const toast = useToast()
	const submit = async () => {
		setSubmitEnabled(false)
		try {
			await props.api.reportIssueAsync({
				eTHTPSDataCoreModelsIssueModel: {
					text: description
				}
			})
			toast({
				title: 'Success',
				description: 'We have received your message',
				status: 'success',
				duration: 9000,
				isClosable: true,
			})
			setTimeout(() => {
				handleClose()
			}, 500)
		}
		catch (e) {
			toast({
				title: 'Error',
				description: 'There was an error processing your request',
				status: 'error',
				duration: 9000,
				isClosable: true,
			})
			console.error(e)
		}
		finally {
			setSubmitEnabled(true)
		}
	}
	return (
		<AlertDialog
			motionPreset="slideInBottom"
			leastDestructiveRef={cancelRef}
			onClose={handleClose}
			isOpen={isOpen}
			isCentered>
			<AlertDialogOverlay />
			<AlertDialogContent>
				<AlertDialogHeader>Report an issue</AlertDialogHeader>
				<AlertDialogCloseButton />
				<AlertDialogBody>
					<Stack spacing={3}>
						<Text color={colors.text} fontSize="md">
							Is there something wrong with the data displayed on
							this page?
						</Text>
						<Textarea
							isInvalid={!descriptionValid}
							onChange={(e) => setDescription(e.target.value)}
							placeholder="Describe the issue"
						/>
						{conditionalRender(<Text>{description?.length}/10</Text>, description?.length < 10)}
					</Stack>
				</AlertDialogBody>
				<AlertDialogFooter>
					<Button ref={cancelRef} onClick={handleClose}>
						Cancel
					</Button>
					<Button
						onClick={submit}
						isDisabled={!submitEnabled}
						colorScheme="green"
						ml={3}>
						Submit
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
