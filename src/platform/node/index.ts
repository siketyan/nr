import { spawn } from "node:child_process";
import { stdout } from "node:process";

import { Platform, Subprocess } from "@/platform";

export const node: Platform = {
  io: {
    stdout: {
      write: (buf) => stdout.write(buf),
    },
  },
  process: {
    args: process.argv.slice(2 + process.execArgv.length),
    exit: (exitCode) => process.exit(exitCode),
  },
  subprocess: {
    run: (cmd, args) => {
      const proc = spawn(cmd, args, {
        cwd: process.cwd(),
      });

      const subprocess: Subprocess = {
        wait: () => {
          if (proc.exitCode !== null) return Promise.resolve(proc.exitCode);
          return new Promise((resolve, reject) => {
            proc.addListener("close", (exitCode) => void resolve(exitCode ?? 0));
            proc.addListener("error", (e) => void reject(e));
          });
        },
      };

      proc.addListener("close", (event) => {
        subprocess.exitCode = event ?? undefined;
      });

      return subprocess;
    },
  },
};
