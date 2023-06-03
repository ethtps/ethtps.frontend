export function useStreamData(newestData, maxEntries = 30) {
    const [opacity, setOpacity] = useState(0)
    const [text, setText] = useState("initialState")
    const [stacks, setStacks] = useState([])
    const [liveData, setLiveData] = useState([])
    const [cumulatedLiveData, setCumulatedLiveData] = useState([])
    const [columns, setColumns] = useState([])
    const [totals, setTotals] = useState([])
    useEffect(() => {
        if (!newestData) return

        setColumns(c => {
            const keys = Object.keys(newestData)
            if (keys?.length === 0) return c

            const newColumns = [...c, ...keys.filter(k => !c.includes(k))]
            setLiveData(l => {
                const dataPoint = {}
                newColumns.forEach(c => dataPoint[c] = newestData[c]?.data.tps)
                setTotals(m => [...m, Object.keys(dataPoint).map(x => dataPoint[x]).reduce((a, b) => (a ?? 0) + (b ?? 0), 0)].slice(-maxEntries))

                setCumulatedLiveData(cd => {
                    let accumulatedLiveData = 0
                    let newDataPoint = {}
                    for (let key in newestData) {
                        newDataPoint[key] = newestData[key]?.data.tps ?? 0 + accumulatedLiveData
                        accumulatedLiveData += newestData[key] ?? 0
                    }
                    return [...cd, newDataPoint].slice(-maxEntries)
                })

                return [...l, dataPoint].slice(-maxEntries)
            })
            return newColumns
        })

    }, [newestData, maxEntries])
    return { opacity, text, stacks, liveData, cumulatedLiveData, columns, totals }
}