import { useEffect } from "react";

export function useDebounceEffect(fn, waitTime, deps) {
  useEffect(() => {
    const t = setTimeout(() => {
      //   fn.apply(undefined, deps)
      fn.apply(undefined);
    }, waitTime);

    return () => {
      clearTimeout(t);
    };
  }, deps);
}
