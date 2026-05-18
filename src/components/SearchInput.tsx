import { ActionIcon, TextInput, TextInputProps, Tooltip } from "@mantine/core";
import { IconSearch, IconX } from "@tabler/icons-react";

interface SearchInputProps extends Omit<TextInputProps, "leftSection" | "rightSection"> {
  value: string;
  onChange: (value: string) => void;
}

export function SearchInput({ value, onChange, ...rest }: SearchInputProps) {
  return (
    <TextInput
      leftSection={<IconSearch size={14} />}
      rightSection={
        value ? (
          <Tooltip label="Clear" withArrow openDelay={300}>
            <ActionIcon variant="subtle" size="sm" onClick={() => onChange("")}>
              <IconX size={12} />
            </ActionIcon>
          </Tooltip>
        ) : null
      }
      value={value}
      onChange={(e) => onChange(e.currentTarget.value)}
      size="sm"
      {...rest}
    />
  );
}
