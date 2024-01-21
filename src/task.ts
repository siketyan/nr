export type Task<T = void, A = void> = {
  run: (arg: A) => Promise<T>;
};

export const parallel =
  (concurrency: number) =>
  <T, A>(...task: Task<T, A>[]): Task<T[], A> => {
    if (concurrency === 0) {
      return { run: (arg: A) => Promise.all(task.map((t) => t.run(arg))) };
    }

    return {
      run: async (arg: A) => {
        const values: T[] = [];
        for (let i = 0; i < task.length; i += concurrency) {
          values.push(...(await Promise.all(task.slice(i, i + concurrency).map((t) => t.run(arg)))));
        }
        return values;
      },
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
