import { ActionIcon } from "@mantine/core";
import { useMantineColorScheme } from "@mantine/core";
import { IconMoon, IconSun } from "@tabler/icons-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { setColorScheme } from "../store/uiSlice";

export function ThemeToggle() {
  const dispatch = useDispatch<AppDispatch>();
  const colorScheme = useSelector((s: RootState) => s.ui.colorScheme);
  const { setColorScheme: mantineSetColorScheme } = useMantineColorScheme();

  function toggle() {
    const next = colorScheme === "dark" ? "light" : "dark";
    dispatch(setColorScheme(next));
    mantineSetColorScheme(next);
  }

  return (
    <ActionIcon variant="subtle" onClick={toggle} aria-label="Toggle color scheme">
      {colorScheme === "dark" ? <IconSun size={18} /> : <IconMoon size={18} />}
    </ActionIcon>
  );
}
