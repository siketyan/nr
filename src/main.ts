import { render } from "ink";
import minimist, { ParsedArgs } from "minimist";

import { node } from "@/platform/node";
import { App } from "@/App";
import { createElement } from "react";

type Args = ParsedArgs & {
  help?: boolean;
  p?: boolean;
};

const platform = node;
const args: Args = minimist(platform.process.args, {
  boolean: ["p"],
});

if (args.help) {
  console.log(`Usage: nr [options] [scripts...]

Options:
  -p: Run scripts in parallel`);

  platform.process.exit(0);
}

render(
  createElement(App, {
    platform,
    criteria: args._,
    isParallel: args.p,
  }),
);
