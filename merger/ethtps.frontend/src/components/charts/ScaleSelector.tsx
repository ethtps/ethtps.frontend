import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { IOnChange } from "../IOnchange";
import { useState, useEffect } from "react";

interface IScaleSelectorProps extends IOnChange {
  scale: string;
}

export function ScaleSelector(props: IScaleSelectorProps) {
  const [scale, setScale] = useState(props.scale);
  useEffect(() => {
    props.onChange(scale);
  }, [scale]);
  return (
    <>
      <ToggleButtonGroup
        color="primary"
        value={scale}
        exclusive
        onChange={(e, v) => setScale(v)}
      >
        <ToggleButton value="log">log</ToggleButton>
        <ToggleButton value="lin">lin</ToggleButton>
      </ToggleButtonGroup>
    </>
  );
}
