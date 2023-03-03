import { Anchor, Center } from "@mantine/core";
import { Fragment } from "react";

export function Logo() {
  return (
    <Fragment>
      <Anchor href="/">
        <Center inline>
          <div
            className={"jumpy unselectable"}
            style={{
              fontSize: 25,
              display: "inline",
            }}
          >
            ETHTPS.info
          </div>
        </Center>
      </Anchor>
    </Fragment>
  );
}
