import { Write } from "@/platform";
import { CR, encode, LF, write } from "@/io";

const ESC = "\x1b";

const eraseLine = (target: "cursor_to_end" | "start_to_cursor" | "start_to_end" = "cursor_to_end"): Uint8Array => {
  const n = (() => {
    if (target === "start_to_cursor") return 1;
    if (target === "start_to_end") return 2;
    return 0;
  })();
  return encode(`${ESC}[${n}K`);
};

const moveUp = (n: number): Uint8Array => encode(`${ESC}[${n}A`);

export type Widget = {
  readonly render: () => string | Uint8Array;
};

export type Console = {
  readonly out: Write;
  readonly lines: Widget[];

  cursor: number;
};

export const createConsole = (out: Write): Console => ({
  out,
  lines: [],
  cursor: 0,
});

export const render = (console: Console): void => {
  console.lines.forEach(({ render }) => {
    write(console.out, render(), eraseLine(), [LF]);
    ++console.cursor;
  });
};

export const rewind = (console: Console): void => {
  write(console.out, [CR], moveUp(console.cursor));
  console.cursor = 0;
};

export type Running = {
  stop: () => void;
};

export const run = (console: Console, interval: number = 50): Running => {
  render(console);

  const reRender = () => {
    rewind(console);
    render(console);
  };

  const timeout = setInterval(reRender, interval);

  return {
    stop: () => {
      clearInterval(timeout);
      reRender();
    },
  };
};

export const append = (console: Console, ...line: Widget[]): void => {
  console.lines.push(...line);
};
