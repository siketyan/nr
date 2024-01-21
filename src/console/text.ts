import { Widget } from "@/console";

export const Text = (text: string): Widget => {
  return { render: () => text };
};
