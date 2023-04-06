import { globalGeneralApi, isEmpty } from './common'
import { DefaultRequestParameters, GenericDictionary } from '../models'

export interface IPageLiveDataDescriptor {
  pageName
  callback: (data: any) => void
  includeSidechains: boolean
  smoothing: string
}

/*
 * A class for providing a way to register single instant data callbacks for pages.
 */
export default class InstantDataService {
  private instantDataForPageCallbackDictionary: GenericDictionary<
    (data: any) => void
  > = { nothing: () => {} }
  private instantDataForPageIntervalRef: NodeJS.Timer
  public smoothing = ''
  public includeSidechains = true

  periodicallyGetInstantDataForPage({
    pageName,
    callback,
    includeSidechains = true,
    smoothing = 'Instant'
  }: IPageLiveDataDescriptor) {
    this.instantDataForPageCallbackDictionary[pageName] = callback
    this.smoothing = smoothing
    this.includeSidechains = includeSidechains
    if (!this.instantDataForPageIntervalRef) {
      this.instantDataForPageIntervalRef = setInterval(
        (() => {
          this.getAndCallbackInstantData()
        }).bind(this),
        5000
      )
    }
  }

  getAndCallbackInstantData() {
    globalGeneralApi.aPIV2InstantDataGet(
      {
        includeSidechains: this.includeSidechains,
        smoothing: this.smoothing,
        ...DefaultRequestParameters
      },
      (err, data, res) => {
        if (
          data !== null &&
          !isEmpty(data) &&
          Object.entries(data).length === 3 &&
          Object.entries(this.instantDataForPageCallbackDictionary).length > 0
        ) {
          Object.entries(this.instantDataForPageCallbackDictionary).forEach(
            ([key, value]) => {
              value(data)
            }
          )
        }
      }
    )
  }
}
