export type Iter<T> = {
  readonly next: () => T;
};

export type Loop<T> = Iter<T>;

export const loop = <T>(...values: T[]): Loop<T> => {
  let idx = 0;
  return {
    next: () => {
      const value = values[idx++];
      if (idx >= values.length) idx = 0;
      return value;
    },
  };
};
