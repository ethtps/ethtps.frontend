import { IOptionalCallback } from '@/data'
import { Completable } from './Completable'
import { FlowStep } from './FlowStep'
export class FlowStepWithComponent extends Completable implements FlowStep {
  constructor(
    public run: () => boolean,
    public component: JSX.Element,
    onCompleted?: IOptionalCallback<boolean>
  ) {
    super(onCompleted)
  }
}
