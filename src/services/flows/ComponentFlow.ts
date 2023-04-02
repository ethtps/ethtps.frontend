import { IOptionalCallback, createHandlerFromCallback } from '@/data/src'
import { FlowStep } from './FlowStep'
import { Completable } from './Completable'
import { Flow } from './Flow'
import { FlowStepWithComponent } from './FlowStepWithComponent'

export class ComponentFlow extends Flow {
  constructor(
    steps: [FlowStepWithComponent],
    onStepChanged?: IOptionalCallback<number>,
    onCompleted?: IOptionalCallback<boolean>,
    public componentChanged?: IOptionalCallback<JSX.Element>
  ) {
    super(
      steps,
      createHandlerFromCallback((v) => {
        if (componentChanged?.callback)
          componentChanged?.callback(steps[v as number].component)
        if (onStepChanged?.callback) onStepChanged?.callback(v as number)
      }),
      onCompleted
    )
  }
}
