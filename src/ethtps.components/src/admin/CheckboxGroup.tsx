import { Badge, Checkbox, FormControl, FormLabel } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'

type CheckBoxGroupProps = {
    checkBoxNames: string[]
    disabledNames: string[]
    allDisabled: boolean
    allChecked: boolean
    onCheck: (name: string, checkDict: Record<string, boolean>) => void
}

export const CheckBbxGroup: React.FC<CheckBoxGroupProps> = ({ checkBoxNames, disabledNames, allDisabled, allChecked, onCheck }) => {
    const [checkDict, setCheckDict] = useState<Record<string, boolean>>({})

    useEffect(() => {
        const initialCheckDict: Record<string, boolean> = {}
        checkBoxNames.forEach(name => {
            initialCheckDict[name] = allChecked
        })
        setCheckDict(initialCheckDict)
    }, [checkBoxNames, allChecked])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.name
        const isChecked = e.target.checked
        setCheckDict(prevState => ({ ...prevState, [name]: isChecked }))

        if (onCheck) {
            onCheck(name, { ...checkDict, [name]: isChecked })
        }
    }

    return (
        <FormControl sx={{ maxHeight: '20rem' }}>
            {checkBoxNames.map(name =>
                <>
                    <FormLabel key={name}>
                        <Badge
                            title={`[${name}]`}
                            sx={{
                                cursor: 'pointer',
                                fontSize: '1rem',
                                fontFamily: 'monospace',
                                opacity: (allDisabled || disabledNames.includes(name)) ? 0.5 : 1,
                            }} />
                    </FormLabel>
                    <Checkbox
                        name={name}
                        disabled={allDisabled || disabledNames.includes(name)}
                        checked={checkDict?.[name] ?? false}
                        onChange={() => handleChange} />
                </>
            )}
        </FormControl>
    )
}