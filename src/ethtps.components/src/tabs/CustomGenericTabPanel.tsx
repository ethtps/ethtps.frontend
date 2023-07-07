import { useEffect, useState } from 'react'

import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'

export interface TabPanelItem {
	title: string
	content: JSX.Element
}

export interface GenericTabPanelProps {
	items: TabPanelItem[]
	localStorageKey: string
}

export function CustomGenericTabPanel({
	items,
	localStorageKey,
}: GenericTabPanelProps): JSX.Element {
	const generateKey = (tab: string) => `${localStorageKey}${tab}`
	const [tabIndex, setTabIndex] = useState(0)

	const handleTabChange = (index: number) => {
		setTabIndex(index)
		localStorage.setItem(
			generateKey(items[index].title),
			JSON.stringify(index)
		)
	}

	useEffect(() => {
		items.forEach((item, index) => {
			const value = localStorage.getItem(generateKey(item.title))
			if (value != null) {
				setTabIndex(JSON.parse(value))
			}
		})
	}, [])

	return (
		<Tabs
			variant="soft-rounded"
			index={tabIndex}
			onChange={handleTabChange}>
			<TabList>
				{items.map((item, index) => (
					<Tab key={index}>{item.title}</Tab>
				))}
			</TabList>
			<TabPanels>
				{items.map((item, index) => (
					<TabPanel key={index}>{item.content}</TabPanel>
				))}
			</TabPanels>
		</Tabs>
	)
}
