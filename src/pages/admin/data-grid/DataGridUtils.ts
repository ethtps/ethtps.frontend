
import { indexCellFormatter } from './Formatters'

export function getDataGridCellFormatter(fullDataTypeName: string) {
  if (fullDataTypeName.toUpperCase().startsWith('PROVIDER')) {
    const propertyName = fullDataTypeName.split('.')[1]
    if (propertyName.toUpperCase() === "ID") {
      return indexCellFormatter
    }
  }
}