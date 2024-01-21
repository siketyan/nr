import { render } from "ink";
import minimist, { ParsedArgs } from "minimist";

import { node } from "@/platform/node";
import { App } from "@/App";
import { createElement } from "react";

type Args = ParsedArgs & {
  help?: boolean;
  p?: boolean | string;
};

const platform = node;
const args: Args = minimist(platform.process.args);

if (args.help) {
  console.log(`Usage: nr [options] [scripts...]

Options:
  -p: Run scripts in parallel`);

  platform.process.exit(0);
}

const concurrency = (() => {
  if (args.p === undefined) return undefined;
  if (typeof args.p === "boolean") return 0;
  if (!Number.isNaN(args.p) && !Number.isNaN(parseInt(args.p))) return parseInt(args.p);

  args._.push(args.p);
  return 0;
})();

render(
  createElement(App, {
    platform,
    concurrency,
    criteria: args._,
  }),
);
