import { useCallback, useState } from 'react';

export const useForceUpdate = () => {
  const [, setState] = useState(true);
  const forceUpdate = useCallback(() => {
    setState((s: boolean) => !s);
  }, []);

  return forceUpdate;
};
