import { Button, Tooltip, Divider, VStack, HStack, Text, Kbd } from "@chakra-ui/react"
import { IconWindowMaximize, IconArrowLeft, IconArrowUp, IconArrowRight, IconArrowDown, IconInfoSquare, IconFocus2 } from "@tabler/icons-react"
import { ExpandType, NormalizeButtonStateDef, binaryConditionalRender, conditionalRender, openNewTab, useColors } from "../../../.."

interface IStreamchartQuickActionsProps {
  normalizeButton: NormalizeButtonStateDef
  showNewTabButton?: boolean
  showResetPositionButton?: boolean
  onReset?: () => void
}

export function StreamchartQuickActions({
  normalizeButton,
  showNewTabButton,
  onReset,
  showResetPositionButton
}: IStreamchartQuickActionsProps) {
  const colors = useColors()
  return <>
    {binaryConditionalRender(
      <>
        <Tooltip label={`Open in a new tab`}>
          <Button
            bg={colors.chartBackground}
            iconSpacing={0}
            leftIcon={<IconWindowMaximize />}
            onClick={() => openNewTab('/live?smaxed=true')}
          />
        </Tooltip>
        <Divider sx={{
          marginTop: 1,
          marginBottom: 1
        }} />
      </>, undefined, showNewTabButton)}
    <Tooltip label={<>
      <VStack w={200}>
        <HStack>
          <Text>Reset position</Text>
          <span>
            <Kbd
              textColor={'black'}>Double click
            </Kbd>
          </span>
        </HStack>
        <HStack>
          <Text>Move</Text>
          <IconArrowLeft />
          <IconArrowUp />
          <IconArrowRight />
          <IconArrowDown />
        </HStack>
      </VStack>
    </>}>
      <Button
        bg={colors.chartBackground}
        iconSpacing={0}
        leftIcon={<IconInfoSquare />}
        disabled />

    </Tooltip>
    <Tooltip label={normalizeButton.text}>
      <Button
        bg={colors.chartBackground}
        iconSpacing={0}
        leftIcon={<normalizeButton.icon />}
        onClick={normalizeButton.toggle} />

    </Tooltip>
    {conditionalRender(
      <Tooltip label={<>
        <VStack w={200}>
          <HStack>
            <Text>Reset position</Text>
            <span>
              <Kbd
                textColor={'black'}>Double click
              </Kbd>
            </span>
          </HStack>
        </VStack>
      </>}>
        <Button
          bg={colors.chartBackground}
          iconSpacing={0}
          leftIcon={<IconFocus2 />}
          onClick={onReset} />

      </Tooltip>, showResetPositionButton)}
  </>
}