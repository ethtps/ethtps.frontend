import { useState, useEffect } from 'react'
import { csv } from 'd3-fetch'

const url =
	'https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/5_OneCatSevNumOrdered_wide.csv'

const row = (d) => {
	d.Amanda = +d['Amanda']
	d.Ashley = +d['Ashley']
	d.Betty = +d['Betty']
	d.Deborah = +d['Deborah']
	d.Dorothy = +d['Dorothy']
	d.Helen = +d['Helen']
	d.Linda = +d['Linda']
	d.Patricia = +d['Patricia']
	d.year = +d['year']
	return d
}

export const useData = () => {
	const [data, setData] = useState(null)
	useEffect(() => {
		// Call d3.csv using row function as accessor
		csv(url, row).then(setData)
	}, [])
	return data
}
