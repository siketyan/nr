import PackageJson from "@npmcli/package-json";
import { Box } from "ink";
import { type FC, useEffect, useState } from "react";

import { ErrorMessage } from "@/components/ErrorMessage";
import { Tasks, TaskStack } from "@/components/TaskStack";
import { Platform } from "@/platform";
import { parallel, serial } from "@/task";

type Props = {
  platform: Platform;
  criteria: string[];
  isParallel?: boolean | undefined;
};

export const App: FC<Props> = ({ platform, criteria, isParallel = false }) => {
  const [packageJson, setPackageJson] = useState<PackageJson>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [tasks, setTasks] = useState<Tasks>({});

  useEffect(() => {
    if (packageJson !== undefined) return;

    PackageJson.load(".").then((j) => {
      setPackageJson(j);
    });
  }, [packageJson]);

  useEffect(() => {
    if (packageJson === undefined) return;
    const scripts = packageJson.content.scripts ?? {};

    (isParallel ? parallel : serial)(
      ...criteria.map((criteria) => ({
        run: async (): Promise<number> => {
          const name = Object.keys(scripts).find((name) => name === criteria);
          if (!name) {
            throw new Error(`Script '${criteria}' is not defined in the package.json.`);
          }

          const proc = platform.subprocess.run("npm", ["run", name]);

          setTasks((tasks) => ({
            ...tasks,
            [name]: {
              name,
              status: "pending",
            },
          }));

          try {
            const exitCode = await proc.wait();

            setTasks((tasks) => ({
              ...tasks,
              [name]: {
                ...tasks[name],
                status: exitCode === 0 ? "success" : "failed",
                description: `Exited with code ${exitCode}`,
              },
            }));

            return exitCode;
          } catch (e) {
            setTasks((tasks) => ({
              ...tasks,
              [name]: { ...tasks[name], status: "failed", description: `${e}` },
            }));

            return 1;
          }
        },
      })),
    )
      .run()
      .then((exitCodes) => {
        platform.process.exit(Math.max(...exitCodes));
      })
      .catch(async (e) => {
        setErrorMessage(e.message);
        platform.process.exit(1);
      });
  }, [platform, criteria, isParallel, packageJson]);

  return (
    <Box flexDirection="column">
      <TaskStack tasks={tasks} />
      {errorMessage && <ErrorMessage message={errorMessage} />}
    </Box>
  );
};
