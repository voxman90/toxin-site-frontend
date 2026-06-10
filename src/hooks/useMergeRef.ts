import type { Ref, RefCallback } from 'react';
import { useCallback } from 'react';

export const useMergeRefs = <T>(...refs: Array<Ref<T> | undefined | null>): RefCallback<T> => {
  return useCallback(
    (value: T | null) => {
      refs.forEach((ref) => {
        if (typeof ref === 'function') {
          ref(value);
        } else if (ref != null) {
          (ref as React.RefObject<T | null>).current = value;
        }
      });
    },
    [...refs],
  );
};
