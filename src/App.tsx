import { detect } from "@antfu/ni";
import { Box } from "ink";
import { minimatch } from "minimatch";
import { type ComponentProps, type FC, useEffect, useState } from "react";

import { Message } from "@/components/Message";
import { Tasks, TaskStack } from "@/components/TaskStack";
import { Platform } from "@/platform";
import { parallel, serial } from "@/task";

type PackageJson = {
  scripts?: Record<string, string>;
};

type Messages = ComponentProps<typeof Message>[];

type Props = {
  platform: Platform;
  criteria: string[];
  concurrency?: number | undefined;
};

export const App: FC<Props> = ({ platform, criteria, concurrency }) => {
  const [packageJson, setPackageJson] = useState<PackageJson>();
  const [messages, setMessages] = useState<Messages>([]);
  const [tasks, setTasks] = useState<Tasks>({});

  useEffect(() => {
    if (packageJson !== undefined) return;

    platform.fs
      .readFile("./package.json")
      .then((buf) => new TextDecoder().decode(buf))
      .then((str) => JSON.parse(str) as PackageJson)
      .then((j) => {
        setPackageJson(j);
      });
  }, [platform, packageJson]);

  useEffect(() => {
    if (packageJson === undefined) return;
    const scripts = packageJson.scripts ?? {};
    const matches = criteria
      .flatMap((pattern) => {
        const names = Object.keys(scripts).filter((name) => minimatch(name, pattern));
        if (names.length === 0) {
          setMessages((msgs) => [
            ...msgs,
            {
              message: `Pattern '${pattern}' does not match any scripts in the package.json.`,
              severity: "warning",
            },
          ]);
        }

        return names;
      })
      .map((name) => ({
        run: async (packageManager: Awaited<ReturnType<typeof detect>>): Promise<number> => {
          const [cmd, args] = (() => {
            if (packageManager === "bun") return ["bun", ["run"]];
            if (packageManager?.startsWith("pnpm")) return ["pnpm", ["run"]];
            if (packageManager?.startsWith("yarn")) return ["yarn", ["run"]];
            return ["npm", ["run"]];
          })();

          const proc = platform.subprocess.run(cmd, [...args, name]);

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
      }));

    detect()
      .then((pm) => {
        if (concurrency === undefined) return serial(...matches).run(pm);
        return parallel(concurrency)(...matches).run(pm);
      })
      .then((exitCodes) => {
        platform.process.exit(exitCodes.length === 0 ? 1 : Math.max(...exitCodes));
      })
      .catch(async (e) => {
        setMessages((msgs) => [...msgs, { message: e.message, severity: "error" }]);
        platform.process.exit(1);
      });
  }, [platform, criteria, concurrency, packageJson]);

  return (
    <Box flexDirection="column">
      {messages.map((message, i) => (
        <Message key={`${i}`} {...message} />
      ))}
      <TaskStack tasks={tasks} />
    </Box>
  );
};
