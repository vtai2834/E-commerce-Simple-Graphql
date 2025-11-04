import emitter from "@utils/emitter";
import { DependencyList, useEffect } from "react";

export const useEmitter = (
  key: string,
  callback: (...args: any[]) => any,
  deps: DependencyList = [],
) => {
  useEffect(() => {
    if (!(key && callback)) return;
    const listener = emitter.addListener(key, callback);
    return () => listener.remove();
  }, [key, ...deps]);

  return emitter;
};
