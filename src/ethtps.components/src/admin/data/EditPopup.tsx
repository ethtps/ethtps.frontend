import { Button, Checkbox, Input, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, Stack } from "@chakra-ui/react"
import { useEffect, useState } from "react"

interface PopupProps<T> {
    isOpen: boolean
    onClose: () => void
    item: T | null
    onEdit: (editedItem: T & Partial<{ id: number }>) => void
    onAdd: (item: T & Partial<{ id: number }>) => void,
    dataTypeName: string
}

export function EditPopup<T extends {}>({ isOpen, onClose, item, onEdit, onAdd, dataTypeName }: PopupProps<T>) {
    const [editableItem, setEditableItem] = useState<T | null>(null)
    const [isSecret, setIsSecret] = useState<boolean>(false)
    const [isEncrypted, setIsEncrypted] = useState<boolean>(false)

    useEffect(() => {
        if (!editableItem) return
        setIsEncrypted(!!editableItem['isEncrypted' as keyof T])
        setIsSecret(!!editableItem['isSecret' as keyof T])
    }, [editableItem])

    useEffect(() => {
        if (item) {
            setEditableItem({ ...item })
        } else {
            setEditableItem(null)
        }
    }, [item])

    const handleEdit = () => {
        if (editableItem) {
            onEdit(editableItem)
            onClose()
        }
    }

    const handleAdd = () => {
        if (editableItem) {
            onAdd(editableItem)
            onClose()
        }
    }

    return (
        <Popover
            isOpen={isOpen} onClose={onClose}>
            <br />
            <PopoverContent>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverHeader>
                    {item ? 'Save' : 'Add'} item
                </PopoverHeader>
                <PopoverBody>
                    <Stack dir={'column'} spacing={2}>
                        {Object.keys(item ?? {}).map(key => {
                            const isBoolean = typeof editableItem?.[key as keyof T] === 'boolean'

                            return (
                                <Stack dir={'row'} spacing={2} key={key}>
                                    {isBoolean ? (
                                        <Checkbox
                                            checked={(editableItem?.[key as keyof T] === true || false)}
                                            onChange={(e) => {
                                                setEditableItem(prevState => ({ ...prevState as any, [key]: e.target.checked }))
                                            }}
                                        />
                                    ) : (
                                        <Input
                                            disabled={['id', 'key'].includes(key)}
                                            sx={{
                                                width: 500
                                            }}
                                            title={key}
                                            type={(isSecret || isEncrypted) && key === 'value' ? 'password' : 'text'}
                                            value={editableItem?.[key as keyof T]?.toString() ?? ''}
                                            multiple={!(isSecret || isEncrypted)}
                                            onChange={(e) => setEditableItem(prevState => ({ ...prevState as any, [key]: e.target.value }))}
                                        />
                                    )}
                                </Stack>
                            )
                        })}
                    </Stack>
                    <>
                        <Button onClick={onClose}>Cancel</Button>
                        <Button onClick={item ? handleEdit : handleAdd} color="primary">{item ? 'Save' : 'Add'}</Button>
                    </>
                </PopoverBody>
            </PopoverContent>
        </Popover>
    )
}
