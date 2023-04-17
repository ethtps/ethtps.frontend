import { IOptionalCallback } from '@/data'
import { FlowStep } from './FlowStep'
import { Completable } from './Completable'

export class Flow extends Completable {
  constructor(
    private steps: [FlowStep],
    public onStepChanged?: IOptionalCallback<number>,
    public onCompleted?: IOptionalCallback<boolean>
  ) {
    super(onCompleted)
  }
  public start() {
    const results: boolean[] = []
    for (let i = 0; i < this.steps.length; i++) {
      this._invokeStepChanged(i)
      const step = this.steps[i]
      results.push(step.run())
    }
    this.completed = true
    if (this.onCompleted?.callback) {
      this.onCompleted?.callback(results.every((x) => x))
    }
  }

  private _invokeStepChanged(step: number) {
    if (this.onStepChanged?.callback) {
      this.onStepChanged?.callback(step)
    }
  }
}
