import PackageJson from "@npmcli/package-json";
import chalk from "chalk";
import minimist, { ParsedArgs } from "minimist";

import { append, createConsole, run, Running } from "@/console";
import { Spinner, Stack, Text } from "@/console/widgets";
import { node } from "@/platform/node";
import { parallel, serial } from "@/task";

const { load } = PackageJson;

type Args = ParsedArgs & {
  help?: boolean;
  p?: boolean;
};

const platform = node;
const args: Args = minimist(platform.process.args);

if (args.help) {
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
  let exitCode = 0;

  (args.p ? parallel : serial)(
    ...args._.map((arg) => ({
      run: async (): Promise<number> => {
        const name = Object.keys(scripts).find((name) => name === arg);
        if (!name) {
          throw new Error(`Script '${arg}' is not defined in the package.json.`);
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
        return proc.exitCode ?? 0;
      },
    })),
  )
    .run()
    .then((exitCodes) => {
      exitCode = Math.max(...exitCodes);
    })
    .catch(async (e) => {
      exitCode = 1;
      append(console, Stack([Text(chalk.bold.red("✖")), Text(`${chalk.bold.whiteBright("Error")}:`), Text(e.message)]));
    })
    .finally(() => {
      running?.stop();
      platform.process.exit(exitCode);
    });

  running = run(console);
})()
  .then()
  .catch((e) => console.error(e));
