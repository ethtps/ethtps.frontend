import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { useEffect, useState } from "react";

interface InfoTypeSelectorParams {
  mode: string;
  onChange: (mode: string) => void;
}

export function InfoTypeSelector(props: InfoTypeSelectorParams) {
  const [mode, setMode] = useState(props.mode);
  useEffect(()=>{
    props.onChange(mode)
  }, [mode])
  return (
    <>
      return (
      <ToggleButtonGroup
        color="primary"
        value={props.mode}
        exclusive
        onChange={(e, value) => setMode(value)}
      >
        <ToggleButton value="tps">tps</ToggleButton>
        <ToggleButton value="gps">gps</ToggleButton>
        <ToggleButton value="gasAdjustedTPS">GTPS</ToggleButton>
      </ToggleButtonGroup>
      );
    </>
  );
}
