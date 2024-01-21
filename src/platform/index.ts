export type Write = {
  readonly write: (buf: Uint8Array) => void;
};

export type Subprocess = {
  exitCode?: number | undefined;
  wait: () => Promise<void>;
};

export type Platform = {
  readonly io: {
    readonly stdout: Write;
  };
  readonly process: {
    readonly args: string[];
    readonly exit: (exitCode: number) => void;
  };
  readonly subprocess: {
    readonly run: (cmd: string, args: string[]) => Subprocess;
  };
};
