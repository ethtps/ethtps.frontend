import { ETHTPSDataCoreModelsDataPointsDataPoint } from 'ethtps.api'
type DataPoint = { seriesName: string; value: number }

export class RandomDataGenerator {
  private timerId: NodeJS.Timeout | null

  constructor(public seriesNames: string[]) {
    this.timerId = null
  }

  private boxMullerRandom(min: number, max: number) {
    let u = 0
    let v = 0
    while (u === 0) u = Math.random() // we need u and v to not be zero
    while (v === 0) v = Math.random()
    let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)
    num = num / 10.0 + 0.5 // Translate to 0 -> 1
    if (num > 1 || num < 0) num = this.boxMullerRandom(min, max) // resample between 0 and 1 if out of range
    num *= max - min // Stretch to fill range
    num += min // offset to min
    return num
  }

  startGeneratingData(
    min: number,
    max: number,
    onDataGenerated: (data: ETHTPSDataCoreModelsDataPointsDataPoint[]) => void
  ) {
    if (this.timerId !== null) {
      throw new Error('Data generation is already in progress.')
    }

    const simulateConnectionTime = () => {
      setTimeout(() => {
        const data: ETHTPSDataCoreModelsDataPointsDataPoint[] = []
        const seriesToGenerate = Math.floor(
          Math.random() * (this.seriesNames.length + 1)
        )

        for (let i = 0; i < seriesToGenerate; i++) {
          const seriesName = this.seriesNames[i]
          const value = this.boxMullerRandom(min, max)
          data.push({ value })
        }

        onDataGenerated(data)
      }, Math.random() * 5000)
    }

    simulateConnectionTime()
  }

  stopGeneratingData() {
    if (this.timerId !== null) {
      clearTimeout(this.timerId)
      this.timerId = null
    }
  }
}
