import React from "react";

export const conditionalRender = (
  component: JSX.Element,
  renderIf?: boolean
) => {
  return renderIf
    ? component
    : React.createElement("div", {
        className: "placeholder",
      });
};

export const binaryConditionalRender = (
  componentIf: JSX.Element,
  componentIfNot: JSX.Element,
  renderIf?: boolean
) => {
  return renderIf ? componentIf : componentIfNot;
};
