import { ActionIcon, Badge, Button, Checkbox, Group, Modal, NumberInput, Select, Stack, Table, Text, Tooltip } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconBell, IconBellOff, IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { addAlert, removeAlert } from "../store/alertsSlice";

export function AlertsButton() {
  const [opened, { open, close }] = useDisclosure(false);
  const alerts = useSelector((s: RootState) => s.alerts.alerts);

  return (
    <>
      <Tooltip label="TPS Alerts" withArrow openDelay={300}>
        <ActionIcon variant="subtle" size="lg" onClick={open}>
          <IconBell size={18} />
          {alerts.length > 0 && (
            <Badge
              size="xs"
              color="red"
              style={{ position: "absolute", top: 2, right: 2, pointerEvents: "none", minWidth: 14, padding: "0 3px" }}
            >
              {alerts.length}
            </Badge>
          )}
        </ActionIcon>
      </Tooltip>
      <AlertsModal opened={opened} onClose={close} />
    </>
  );
}

function AlertsModal({ opened, onClose }: { opened: boolean; onClose: () => void }) {
  const dispatch = useDispatch<AppDispatch>();
  const networks = useSelector((s: RootState) => s.networks.networks);
  const alerts = useSelector((s: RootState) => s.alerts.alerts);

  const [chainId, setChainId] = useState<number | null>(null);
  const [threshold, setThreshold] = useState<number | string>(100);
  const [persist, setPersist] = useState(false);
  const [permDenied, setPermDenied] = useState(Notification.permission === "denied");

  const chainOptions = networks
    .filter((n) => n.enabled)
    .map((n) => ({ value: String(n.chainId), label: n.name }))
    .sort((a, b) => a.label.localeCompare(b.label));

  async function requestPermission() {
    const result = await Notification.requestPermission();
    setPermDenied(result === "denied");
  }

  function handleAdd() {
    if (chainId == null || !threshold) return;
    const network = networks.find((n) => n.chainId === chainId);
    if (!network) return;
    dispatch(addAlert({ chainId, chainName: network.name, threshold: Number(threshold), persist }));
    setChainId(null);
    setThreshold(100);
    setPersist(false);
  }

  const notifSupported = "Notification" in window;

  return (
    <Modal opened={opened} onClose={onClose} title="TPS Threshold Alerts" size="md">
      <Stack gap="md">
        {!notifSupported && (
          <Text c="red" size="sm">Browser notifications are not supported in this browser.</Text>
        )}
        {notifSupported && Notification.permission === "default" && (
          <Group>
            <Text size="sm" c="dimmed">Enable browser notifications to receive alerts.</Text>
            <Button size="xs" variant="light" onClick={requestPermission}>Enable notifications</Button>
          </Group>
        )}
        {permDenied && (
          <Text c="orange" size="sm">Notifications are blocked. Enable them in browser settings to receive alerts.</Text>
        )}

        <Stack gap="xs">
          <Text fw={500} size="sm">Add alert</Text>
          <Select
            placeholder="Select chain…"
            data={chainOptions}
            value={chainId != null ? String(chainId) : null}
            onChange={(v) => setChainId(v != null ? Number(v) : null)}
            searchable
            size="sm"
          />
          <NumberInput
            label="TPS threshold"
            placeholder="e.g. 150"
            value={threshold}
            onChange={setThreshold}
            min={0}
            step={10}
            size="sm"
          />
          <Checkbox
            label="Keep active after triggering (always-on)"
            checked={persist}
            onChange={(e) => setPersist(e.currentTarget.checked)}
            size="sm"
          />
          <Button
            size="sm"
            leftSection={<IconBell size={14} />}
            onClick={handleAdd}
            disabled={chainId == null || !threshold}
          >
            Add alert
          </Button>
        </Stack>

        {alerts.length > 0 && (
          <Stack gap="xs">
            <Text fw={500} size="sm">Active alerts</Text>
            <Table striped withTableBorder>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Chain</Table.Th>
                  <Table.Th>Threshold</Table.Th>
                  <Table.Th>Mode</Table.Th>
                  <Table.Th></Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {alerts.map((alert) => (
                  <Table.Tr key={alert.id}>
                    <Table.Td>{alert.chainName}</Table.Td>
                    <Table.Td>&gt; {alert.threshold} TPS</Table.Td>
                    <Table.Td>
                      {alert.persist ? (
                        <Badge color="blue" size="xs" leftSection={<IconBell size={10} />}>Always</Badge>
                      ) : (
                        <Badge color="gray" size="xs" leftSection={<IconBellOff size={10} />}>Once</Badge>
                      )}
                    </Table.Td>
                    <Table.Td>
                      <ActionIcon
                        color="red"
                        variant="subtle"
                        size="sm"
                        onClick={() => dispatch(removeAlert(alert.id))}
                      >
                        <IconTrash size={14} />
                      </ActionIcon>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Stack>
        )}

        {alerts.length === 0 && (
          <Text c="dimmed" size="sm" ta="center">No active alerts. Add one above.</Text>
        )}
      </Stack>
    </Modal>
  );
}
