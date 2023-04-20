import { IOptionalCallback } from "@/data"
import { ComponentFlow, FlowStepWithComponent } from ".."

export class AuthenticationFlow extends ComponentFlow {
  constructor(
    onStepChanged?: IOptionalCallback<number>,
    onCompleted?: IOptionalCallback<boolean>,
    componentChanged?: IOptionalCallback<JSX.Element>
  ) {
    super(
      [
        {} as FlowStepWithComponent
      ],
      onStepChanged,
      onCompleted,
      componentChanged
    )
  }
}

export { }
