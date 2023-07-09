import NonSSRWrapper from '../../NonSSRWrapper'

export function CrosshairDiv(props: { children: JSX.Element }) {
    return (
        <>
            <NonSSRWrapper>
            </NonSSRWrapper>
            {props.children}
        </>
    )
}