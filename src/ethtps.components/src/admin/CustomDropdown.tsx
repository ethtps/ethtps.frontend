import { Select } from '@chakra-ui/react'

interface DropdownProps<T> {
    options: T[]
    selectedOption?: T
    displayedKey: keyof T
    onChange?: (option?: T, callerKey?: string | number | React.Key) => void
    customKey?: string | number | React.Key
    placeholder?: string
    disabledOptions?: T[]
    extraOptions?: T[]
    required?: boolean
}

export function CustomDropdown<T extends {}>({ options, selectedOption, displayedKey, onChange, customKey, placeholder, disabledOptions, extraOptions, required }: DropdownProps<T>) {
    const allOptions = [...options, ...(extraOptions ?? [])]
    const handleChange = (event: any, child?: HTMLCollection) => {
        const selected = allOptions?.find(option => String(option[displayedKey]) === String(event.target.value))
        onChange?.(selected, customKey)
    }

    return (
        <Select
            required={required}
            key={customKey}
            placeholder={placeholder}
            onChange={(e) => handleChange(e, e.currentTarget?.children)}
        >
            {allOptions?.map((option, index) => (
                <option
                    key={index}
                    disabled={disabledOptions?.includes(option)}
                    value={String(option[displayedKey])}>
                    {String(option[displayedKey])}
                </option>
            ))}
        </Select>
    )
}
