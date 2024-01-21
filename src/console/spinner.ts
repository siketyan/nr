import { Widget } from "@/console/index";
import { loop } from "@/iter";

const DEFAULT_CHARS = "⠁⠂⠄⡀⢀⠠⠐⠈";

export const Spinner = (chars: string = DEFAULT_CHARS): Widget => {
  const iter = loop(...chars.split(""));
  return {
    render: () => iter.next(),
  };
};
