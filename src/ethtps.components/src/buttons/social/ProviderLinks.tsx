import {
	Box,
	Card,
	CardBody,
	CardHeader,
	Divider,
	Heading,
	Skeleton,
	Stack,
} from '@chakra-ui/react'
import { Dictionary } from '@reduxjs/toolkit'
import {
	ETHTPSDataCoreModelsResponseModelsProviderResponseModel,
	ETHTPSDataIntegrationsMSSQLExternalWebsite,
	ETHTPSDataIntegrationsMSSQLExternalWebsiteCategory,
	ETHTPSDataIntegrationsMSSQLProviderLink,
} from 'ethtps.api'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { binaryConditionalRender, conditionalRender, useColors } from '../../..'
import { ETHTPSApi, groupBy } from '../../../../ethtps.data/src'
import { TryAgainLink } from '../TryAgainLink'

interface IProviderLinksProps {
	provider: ETHTPSDataCoreModelsResponseModelsProviderResponseModel
	providerLinks?: ETHTPSDataIntegrationsMSSQLProviderLink[]
	api: ETHTPSApi
}

const createLinks = (
	providerLinks?: ETHTPSDataIntegrationsMSSQLProviderLink[],
	websites?: ETHTPSDataIntegrationsMSSQLExternalWebsite[]
) => { }
/* Cases:
1 - Loading (&& no error) (x)
2 - Error (x)
3 - No links
4 - Ok
*/
export function ProviderLinks(
	props: Partial<IProviderLinksProps>
): JSX.Element {
	const api = props.api
	const colors = useColors()
	const [loadedWebsites, setLoadedWebsites] = useState<boolean>(false)
	const [loadedWebsiteCategories, setLoadedWebsiteCategories] =
		useState<boolean>(false)
	const [hasError, setHasError] = useState<boolean>(false)
	const [websites, setWebsites] =
		useState<Dictionary<ETHTPSDataIntegrationsMSSQLExternalWebsite[]>>()
	const [groupedLinks, setGroupedLinks] = useState<
		Dictionary<ETHTPSDataIntegrationsMSSQLProviderLink[]> | undefined
	>()
	const [categories, setCategories] =
		useState<ETHTPSDataIntegrationsMSSQLExternalWebsiteCategory[]>()
	useEffect(() => {
		api
			?.getAllExternalWebsites()
			.then((response) => {
				const value = response.filter(
					(x) =>
						props.providerLinks?.find(
							(y) => y.externalWebsiteId === x.id
						)
				)
				setWebsites(
					groupBy(value, (x) => (x.category ?? -1).toString())
				)
				setLoadedWebsites(true)
			})
			.catch(() => setHasError(true))
	}, [props.providerLinks, api])

	useEffect(() => {
		api
			?.getAllExternalWebsiteCategories()
			.then((response) => {
				setCategories(response)
				setLoadedWebsiteCategories(true)
			})
			.catch(() => setHasError(true))
	}, [websites, api])

	useEffect(() => {
		if (categories) {
			const c = Object.keys(categories)
		}
		setGroupedLinks(
			groupBy(props.providerLinks, (x) =>
				(
					categories?.find(
						(z) =>
							z.id ===
							websites?.[z.id ?? '']?.find(
								(q) => q.id === x.externalWebsiteId
							)
					)?.id ?? 0
				).toString()
			)
		)
	}, [categories])

	return (
		<Card
			sx={{
				backgroundColor: colors.muted,
				margin: '1rem',
				padding: '1rem',
				borderRadius: '0.5rem',
			}}>
			<Skeleton
				fadeDuration={2}
				isLoaded={
					(loadedWebsites && loadedWebsiteCategories) || hasError
				}>
				<CardHeader>
					<Heading size="md">
						Useful links for {props.provider?.name}
					</Heading>
				</CardHeader>
			</Skeleton>

			<CardBody>
				<Stack spacing="4">
					<Skeleton
						fadeDuration={3}
						isLoaded={
							(loadedWebsites && loadedWebsiteCategories) ||
							hasError
						}>
						{binaryConditionalRender(
							<>
								{conditionalRender(
									<>
										{Object.keys(groupedLinks ?? {}).map(
											(key, index) => {
												const categoryID = parseInt(key)
												const category =
													categories?.find(
														(z) =>
															z.id === categoryID
													)
												console.log(key)
												return (
													<Box
														key={`${category?.name}${index}`}
														mt={
															index > 0
																? '4'
																: '0'
														}>
														{index > 0 && (
															<Divider
																sx={{
																	my: '1rem',
																}}
															/>
														)}
														<Heading
															size="xs"
															textTransform="uppercase"
															mb="1rem">
															{category?.name}
														</Heading>
														{groupedLinks?.[
															key
														]?.map(
															(
																website,
																index
															) => {
																return (
																	<Card
																		sx={{
																			backgroundColor:
																				colors.muted,
																			marginBottom:
																				'1rem',
																		}}
																		key={
																			index
																		}>
																		<CardBody>
																			<Link
																				href={
																					website.link ??
																					'/'
																				}>
																				{websites?.[
																					key
																				]?.find(
																					(
																						x
																					) =>
																						x.id ===
																						website.externalWebsiteId
																				)
																					?.name ??
																					website.link
																						?.replace(
																							'http://',
																							''
																						)
																						.replace(
																							'https://',
																							''
																						)}
																			</Link>
																		</CardBody>
																	</Card>
																)
															}
														)}
													</Box>
												)
											}
										)}
									</>,
									(categories?.length ?? 0) > 0
								)}
							</>,
							<TryAgainLink />,
							!hasError
						)}
					</Skeleton>
				</Stack>
			</CardBody>
		</Card>
	)
}
