import { createContext, useContext } from "react";

import { Platform } from "@/platform";
import { node } from "@/platform/node";

const ctx = createContext<Platform>(node);

export const usePlatform = () => {
  const platform = useContext(ctx);
  return { platform };
};
