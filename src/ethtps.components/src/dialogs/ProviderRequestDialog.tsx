import React, { useState, useEffect } from 'react'
import {
	Button,
	AlertDialog,
	AlertDialogOverlay,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogCloseButton,
	AlertDialogBody,
	AlertDialogFooter,
	Input,
	Stack,
} from '@chakra-ui/react'

interface IProviderRequestDialogProps {
	isOpen: boolean
	onClose: () => void
}

export function ProviderRequestDialog(props: IProviderRequestDialogProps) {
	const { isOpen, onClose } = props
	const cancelRef = React.useRef<any>(null)

	const [networkName, setNetworkName] = useState('')
	const [networkType, setNetworkType] = useState('')
	const [website, setWebsite] = useState('')
	const [description, setDescription] = useState('')
	const [explorerUrl, setExplorerUrl] = useState('')

	const [isNetworkNameValid, setIsNetworkNameValid] = useState(true)
	const [isNetworkTypeValid, setIsNetworkTypeValid] = useState(true)
	const [isWebsiteValid, setIsWebsiteValid] = useState(true)

	const [submitEnabled, setSubmitEnabled] = useState(false)

	useEffect(() => {
		const validateInput = () => {
			let isValid = true
			if (!networkName) {
				isValid = false
				setIsNetworkNameValid(false)
			} else {
				setIsNetworkNameValid(true)
			}

			if (!networkType) {
				isValid = false
				setIsNetworkTypeValid(false)
			} else {
				setIsNetworkTypeValid(true)
			}

			if (!website) {
				isValid = false
				setIsWebsiteValid(false)
			} else {
				setIsWebsiteValid(true)
			}

			setSubmitEnabled(isValid)
		}

		validateInput()
	}, [networkName, networkType, website])

	const handleClose = () => {
		onClose()
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
				<AlertDialogHeader>L2 addition request</AlertDialogHeader>
				<AlertDialogCloseButton />
				<AlertDialogBody>
					<Stack spacing={3}>
						<Input
							size="md"
							placeholder="Network name (required)"
							value={networkName}
							onChange={(e) => setNetworkName(e.target.value)}
							isInvalid={!isNetworkNameValid}
						/>
						<Input
							size="md"
							placeholder="Network type (required)"
							value={networkType}
							onChange={(e) => setNetworkType(e.target.value)}
							isInvalid={!isNetworkTypeValid}
						/>
						<Input
							size="md"
							placeholder="Project website (required)"
							value={website}
							onChange={(e) => setWebsite(e.target.value)}
							isInvalid={!isWebsiteValid}
						/>
						<Input
							size="md"
							placeholder="Short description (optional)"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
						/>
						<Input
							size="md"
							placeholder="Block explorer URL (optional)"
							value={explorerUrl}
							onChange={(e) => setExplorerUrl(e.target.value)}
						/>
					</Stack>
				</AlertDialogBody>
				<AlertDialogFooter>
					<Button ref={cancelRef} onClick={handleClose}>
						Cancel
					</Button>
					<Button
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
