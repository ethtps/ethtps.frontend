import { Completable } from './Completable'

export interface FlowStep extends Completable {
  run: () => boolean
}
