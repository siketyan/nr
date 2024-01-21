import { Box, Text } from "ink";
import { type FC } from "react";

type Props = {
  message: string;
};

export const ErrorMessage: FC<Props> = ({ message }) => {
  return (
    <Box gap={1}>
      <Text bold color="red">
        !
      </Text>
      <Box>
        <Text bold color="whiteBright">
          Error
        </Text>
        <Text>:</Text>
      </Box>
      <Text>{message}</Text>
    </Box>
  );
};
