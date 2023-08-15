export function VisLayer(props: {
  children: React.ReactNode
}) {
  return (<g>
    {props.children}
  </g>)
}