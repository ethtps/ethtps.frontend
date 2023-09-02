import { RenderRowProps, Row } from "react-data-grid"

function indexCellFormatter(key: React.Key, props: RenderRowProps<number>) {
  return (
    <Row key={`index-${key}`} {...props} />
  )
}

export { indexCellFormatter }