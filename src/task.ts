export type Task<T = void, A = void> = {
  run: (arg: A) => Promise<T>;
};

export const parallel = <T, A>(...task: Task<T, A>[]): Task<T[], A> => {
  return {
    run: (arg: A) => Promise.all(task.map((t) => t.run(arg))),
  };
};

export const serial = <T, A>(...task: Task<T, A>[]): Task<T[], A> => {
  return {
    run: async (arg: A) => {
      const values: T[] = [];
      for (const t of task) {
        values.push(await t.run(arg));
      }
      return values;
    },
  };
};
