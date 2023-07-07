export function getRandomUnemploymentData(numberOfDays, numberOfIndustries) {
	// List of industry names.
	const industries = Array.from(
		{ length: numberOfIndustries },
		(_, i) => `Industry ${i + 1}`
	)

	// Generate dates for specified number of days starting from today.
	const today = new Date()
	const dates = Array.from({ length: numberOfDays }, (_, i) => {
		const date = new Date(today)
		date.setDate(today.getDate() + i)
		return date
	})

	// Generate random data for each date and each industry.
	const data = dates.flatMap((date) => {
		return industries.map((industry) => {
			return {
				date: date,
				unemployed: +(Math.random() * 10).toFixed(2),
				industry: industry,
			}
		})
	})

	return data
}
