import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { useState, useEffect } from "react";
import { conditionalRender } from "../Helpers";

const defaultIntervals = ["1h", "1d", "1w", "1m", "1y", "All"];

interface IIntervalSelectorParameters {
  interval: string;
  years: string[];
  onChange: (interval: string) => void;
  onYearChange: (year: string) => void;
}

export function IntervalSelector(props: IIntervalSelectorParameters) {
  const [interval, setInterval] = useState(props.interval);
  const [allIntervals, setAllIntervals] = useState(defaultIntervals);
  const [years, setYears] = useState<string[]>(props.years);
  const [selectedYear, setSelectedYear] = useState<string>();
  useEffect(() => {
    props.onYearChange(selectedYear);
  }, [selectedYear]);
  useEffect(() => {
    props.onChange(interval);
  }, [interval]);
  return (
    <>
      <div
        style={
          props.years.length > 0
            ? {
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around",
                flexWrap: "wrap",
              }
            : {
              display: "none"
            }
        }
      >
        {conditionalRender(
          <>
            <ToggleButtonGroup
              color="primary"
              style={{ marginTop: "5px" }}
              value={selectedYear}
              exclusive
              onChange={(e, v) => setSelectedYear(v)}
            >
              {years?.map((x) => (
                <ToggleButton value={x}>{x}</ToggleButton>
              ))}
            </ToggleButtonGroup>
          </>,
          years !== undefined
        )}

        <ToggleButtonGroup
          color="primary"
          style={
            props.years.length > 0
              ? { marginTop: "5px" }
              : { float: "right" }
          }
          value={interval}
          exclusive
          onChange={(e, v) => setInterval(v)}
        >
          {allIntervals.map((x: string) => (
            <ToggleButton value={x}>{x}</ToggleButton>
          ))}
        </ToggleButtonGroup>
      </div>
    </>
  );
}
