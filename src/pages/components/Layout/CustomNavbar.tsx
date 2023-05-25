import { ProviderResponseModel } from "@/api-client"
import { loadProvidersAsync } from "@/data"
import { conditionalRender, queryClient } from "@/services"
import { Image, Checkbox, Badge } from "@chakra-ui/react"
// eslint-disable-next-line import/no-internal-modules
import Link from "next/link"
import { useState } from "react"

interface ICustomNavbarProps {
    opened: boolean,
    allProviders?: ProviderResponseModel[]
    currentProvider?: string
}

export default function CustomNavbar({
    opened,
    allProviders,
    currentProvider
}: ICustomNavbarProps) {
    const [filteredProviders, setFilteredProviders] = useState(allProviders)
    const hideSidechainsChanged = (e: any) => {
        if (e.target.checked) {
            setFilteredProviders(allProviders?.filter(x => x.type !== 'Sidechain'))
        } else {
            setFilteredProviders(allProviders)
        }
    }
    return <></>
}
    /*
return <>
<Navbar p="md" hiddenBreakpoint="sm" hidden={!opened} width={{ sm: 200, lg: 300 }}>
    <Navbar.Section mt="xs">
    </Navbar.Section>
    <Navbar.Section component={ScrollArea} mx="-xs" px="xs">
    </Navbar.Section>
    <Navbar.Section>
    </Navbar.Section>
</Navbar>
</>
}
return <>
<Navbar p="md" hiddenBreakpoint="sm" hidden={!opened} width={{ sm: 200, lg: 300 }}>
<Navbar.Section mt="xs">
<>
<center>
<Badge sx={{
fontSize: 16,
marginBottom: '2rem',
fontWeight: 'bold',
cursor: 'default'
}}
color={'violet'}>
Rollups
</Badge>
</center>
</>
</Navbar.Section>
<Navbar.Section grow component={ScrollArea} mx="-xs" px="xs">
<Stack dir="row">
{filteredProviders?.map((x, i) =>
<div key={x.name}
style={{
backgroundColor: currentProvider === x.name ? "#f8f8f8" : undefined,
fontWeight: currentProvider === x.name ? "bold" : undefined,
}}>
<NavLink
active={currentProvider === x.name}
component={Link}
href={`/providers/${x.name}`}
label={x.name}
icon={<Image
alt={`${x.name} icon`}
src={`/provider-icons/${x.name}.png`}
width={'20px'}
height={'20px'}
/>}
></NavLink>
</div>
)}
{conditionalRender(<>
<Skeleton height={8} radius="xl" style={{ marginBottom: '1rem' }} />
</>, !filteredProviders || filteredProviders?.length === 0)}
</Stack>
</Navbar.Section>
<Navbar.Section>
<Checkbox onChange={hideSidechainsChanged} size="sm" className={'unselectable'} label={'Hide sidechains'} />
</Navbar.Section>
</Navbar>
</>
}
*/