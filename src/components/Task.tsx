import { Box, Text } from "ink";
import { type FC } from "react";

import { Spinner } from "./Spinner";

export type Status = "pending" | "success" | "failed";

type Props = {
  name: string;
  status: Status;
  description?: string;
};

export const Task: FC<Props> = ({ name, status, description }) => {
  return (
    <Box gap={1}>
      {status === "pending" ? (
        <Spinner />
      ) : status === "success" ? (
        <Text bold color="green">
          ✔
        </Text>
      ) : (
        <Text bold color="red">
          ✖
        </Text>
      )}
      <Box>
        <Text bold color="whiteBright">
          {name}
        </Text>
        {description && <Text>:</Text>}
      </Box>
      {description && <Text>{description}</Text>}
    </Box>
  );
};
