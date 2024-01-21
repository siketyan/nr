import { Box } from "ink";
import { type ComponentProps, type FC } from "react";

import { Task } from "./Task";

export type Tasks = Record<string, ComponentProps<typeof Task>>;

type Props = {
  tasks: Tasks;
};

export const TaskStack: FC<Props> = ({ tasks }) => {
  return (
    <Box flexDirection="column">
      {Object.values(tasks).map(({ name, status, description }, i) => (
        <Task key={`${i}`} name={name} status={status} description={description} />
      ))}
    </Box>
  );
};
