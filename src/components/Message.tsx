import { Box, Text } from "ink";
import { type FC } from "react";

type Props = {
  message: string;
  severity: "error" | "warning";
};

export const Message: FC<Props> = ({ message, severity }) => {
  const { title, color } = (() => {
    if (severity === "error") return { title: "Error", color: "red" };
    return { title: "Warning", color: "yellow" };
  })();

  return (
    <Box gap={1}>
      <Text bold color={color}>
        !
      </Text>
      <Box>
        <Text bold color="whiteBright">
          {title}
        </Text>
        <Text>:</Text>
      </Box>
      <Text>{message}</Text>
    </Box>
  );
};
