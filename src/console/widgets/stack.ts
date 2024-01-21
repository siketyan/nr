import { Widget } from "@/console";
import { BufferLike, concat } from "@/io";

export const Stack = (children: Widget[], gap: number = 1): Widget => {
  return {
    render: () => {
      const parts: BufferLike[] = [];

      children.forEach((child, i) => {
        parts.push(child.render());
        if (i < children.length - 1) parts.push(" ".repeat(gap));
      });

      return concat(...parts);
    },
  };
};
