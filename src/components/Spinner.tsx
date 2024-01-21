import { Text } from "ink";
import { type FC, useEffect, useState } from "react";

const DEFAULT_CHARS = "⠁⠂⠄⡀⢀⠠⠐⠈";

type Props = {
  chars?: string[] | undefined;
  interval?: number | undefined;
};

export const Spinner: FC<Props> = ({ chars = DEFAULT_CHARS.split(""), interval = 100 }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((idx) => {
        if (idx >= chars.length - 1) return 0;
        return idx + 1;
      });
    }, interval);

    return () => void clearInterval(timer);
  });

  return <Text>{chars[index]}</Text>;
};
