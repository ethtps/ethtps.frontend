export interface ICustomButtonGroupParameters {
  buttons?: string[]
  props?: any
  sx?: any
  selected?: string
  onChange?: (value: string) => void
  tooltipFunction?: (value: string) => string
  highlighed?: string
}
