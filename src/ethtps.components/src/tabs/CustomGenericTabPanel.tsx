import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useQueryStringAndLocalStorageBoundState } from '..'

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
	const [tabIndex, setTabIndex] = useQueryStringAndLocalStorageBoundState<number | undefined>(undefined, localStorageKey)

	const handleTabChange = (index: number) => {
		setTabIndex(index)
		localStorage.setItem(
			generateKey(items[index].title),
			JSON.stringify(index)
		)
	}

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
