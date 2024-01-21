import PackageJson from "@npmcli/package-json";
import chalk from "chalk";
import minimist from "minimist";

import { append, createConsole, run, Running } from "@/console";
import { Spinner, Stack, Text } from "@/console/widgets";
import { node } from "@/platform/node";
import { parallel, serial } from "@/task";

const { load } = PackageJson;

const platform = node;
const args = minimist(platform.process.args);

if ("help" in args) {
  console.log(`Usage: nr [options] [scripts...]

Options:
  -p: Run scripts in parallel`);

  platform.process.exit(0);
}

(async () => {
  const packageJson = await load(".");
  const scripts = packageJson.content.scripts ?? {};

  const console = createConsole(platform.io.stdout);
  let running: Running | undefined = undefined;

  ("p" in args ? parallel : serial)(
    ...args._.map((arg) => ({
      run: async () => {
        const name = Object.keys(scripts).find((name) => name === arg);
        if (!name) {
          append(
            console,
            Stack([
              Text(chalk.bold.red("✖")),
              Text(`${chalk.bold.whiteBright(arg)}:`),
              Text("Error: Script is not defined in the package.json."),
            ]),
          );

          return;
        }

        const spinner = Spinner();
        const proc = platform.subprocess.run("npm", ["run", name]);

        append(console, {
          render: () => {
            if (proc.exitCode !== undefined) {
              return Stack([
                Text(proc.exitCode === 0 ? chalk.bold.green("✔") : chalk.bold.red("✖")),
                Text(`${chalk.bold.whiteBright(arg)}:`),
                Text(`Exited with code ${proc.exitCode}`),
              ]).render();
            }

            return Stack([spinner, Text(chalk.bold.whiteBright(name))]).render();
          },
        });

        await proc.wait();
      },
    })),
  )
    .run()
    .finally(() => {
      running?.stop();
    });

  running = run(console);
})()
  .then()
  .catch((e) => console.error(e));
