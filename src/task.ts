export type Task<T = void> = {
  run: () => Promise<T>;
};

export const parallel = <T>(...task: Task<T>[]): Task<T[]> => {
  return {
    run: () => Promise.all(task.map((t) => t.run())),
  };
};

export const serial = <T>(...task: Task<T>[]): Task<T[]> => {
  return {
    run: async () => {
      const values: T[] = [];
      for (const t of task) {
        values.push(await t.run());
      }
      return values;
    },
  };
};
