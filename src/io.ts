import { Write } from "@/platform";

export type BufferLike = string | number[] | Uint8Array;

export const LF = 0x0a;
export const CR = 0x0d;

export const encode = (buf: BufferLike): Uint8Array => {
  if (buf instanceof Uint8Array) return buf;
  if (Array.isArray(buf)) return Uint8Array.from(buf);
  return new TextEncoder().encode(buf);
};

export const concat = (...buf: BufferLike[]): Uint8Array => {
  const bytes: number[] = [];

  buf.forEach((b) => {
    bytes.push(...encode(b));
  });

  return Uint8Array.from(bytes);
};

export const write = (out: Write, ...buf: BufferLike[]): void => {
  buf.forEach((b) => {
    out.write(encode(b));
  });
};

export const writeln = (out: Write, ...buf: BufferLike[]) => {
  write(out, ...buf, [LF]);
};
