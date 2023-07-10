import {
	AlertDialog,
	AlertDialogBody,
	AlertDialogCloseButton,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogOverlay,
	Button,
	Input,
	Stack,
	Tooltip,
	useToast,
} from '@chakra-ui/react'
import { ETHTPSDataIntegrationsMSSQLProviderType } from 'ethtps.api'
import React, { useEffect, useState } from 'react'
import { CustomDropdown, useColors } from '..'
import { ETHTPSApi } from '../../../ethtps.data/src'

interface IProviderRequestDialogProps {
	isOpen: boolean
	onClose: () => void
	networkTypes: ETHTPSDataIntegrationsMSSQLProviderType[]
	api: ETHTPSApi
}

export function ProviderRequestDialog({
	...props
}: IProviderRequestDialogProps) {
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
	const colors = useColors()
	const [dropdownOption, setDropdownOption] = useState<string>()
	const toast = useToast()
	const submit = async () => {
		setSubmitEnabled(false)
		try {
			await props.api.createProviderRequestAsync({
				eTHTPSDataCoreModelsQueriesDataRequestsL2AdditionRequestModel: {
					networkName,
					type: networkType,
					projectWebsite: website,
					shortDescription: description,
					blockExplorerURL: explorerUrl
				}
			})
			toast({
				title: 'Success',
				description: 'We have received your request',
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
				const re1 = /^[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/
				const re2 = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/
				if (re1.test(website) || re2.test(website)) setIsWebsiteValid(true)
				else isValid = false
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
			closeOnOverlayClick={false} // Whoever opens this probably means to do so - but might accidentally click outside of the dialog and close it so we make sure they *want* to close it useGellMannEffect(()=>{},[]) lol
			motionPreset="slideInBottom"
			leastDestructiveRef={cancelRef}
			onClose={handleClose}
			isOpen={isOpen}
			isCentered>
			<AlertDialogOverlay />
			<AlertDialogContent>
				<AlertDialogHeader>Request to include an L2</AlertDialogHeader>
				<Tooltip label={'Close'}>
					<AlertDialogCloseButton />
				</Tooltip>
				<AlertDialogBody>
					<Stack spacing={3}>
						<Input
							_placeholder={{
								color: colors.text,
							}}
							size="md"
							placeholder="Network name (required)"
							value={networkName}
							onChange={(e) => setNetworkName(e.target.value)}
							isInvalid={!isNetworkNameValid}
						/>
						<CustomDropdown
							required
							onChange={(o, k) => {
								if (o?.name) {
									setDropdownOption(o.name)
									if (o.name !== 'Something else...') {
										setNetworkType(o.name)
									}
									else {
										setNetworkType('')
									}
								}
							}}
							displayedKey={'name'}
							placeholder='Network type (required)'
							disabledOptions={props.networkTypes.filter(o => o.name === 'Mainnet')}
							extraOptions={[{ name: 'Not sure' }, { name: 'Something else...' }]}
							options={props.networkTypes} />
						<Input
							hidden={dropdownOption !== 'Something else...'}
							_placeholder={{
								color: colors.text,
							}}
							size="md"
							placeholder="Network type (required)"
							value={networkType}
							onChange={(e) => setNetworkType(e.target.value)}
							isInvalid={!isNetworkTypeValid}
						/>
						<Input
							_placeholder={{
								color: colors.text,
							}}
							size="md"
							placeholder="Project website (required)"
							value={website}
							onChange={(e) => setWebsite(e.target.value)}
							isInvalid={!isWebsiteValid}
						/>
						<Input
							_placeholder={{
								color: colors.text,
							}}
							size="md"
							placeholder="Short description (optional)"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
						/>
						<Input
							_placeholder={{
								color: colors.text,
							}}
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
