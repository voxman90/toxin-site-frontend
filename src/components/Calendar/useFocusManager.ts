import { useEffect, useMemo, useRef, useState } from 'react';

import type { FocusStatus, FocusTarget } from './FocusController';
import FocusController from './FocusController';

interface FocusManagerParams {
  isSliding: boolean;
  isZooming: boolean;
  initialDate: Date;
}

const useFocusManager = ({ isSliding, isZooming, initialDate }: FocusManagerParams) => {
  const [focusedDate, setFocusedDate] = useState<Date>(initialDate);
  const [focusedTarget, setFocusedTarget] = useState<FocusTarget | null>(null);

  const statusRef = useRef<FocusStatus>({
    focusedDate,
    isSliding,
    isZooming,
  });

  statusRef.current = {
    focusedDate,
    isSliding,
    isZooming,
  };

  const controller = useMemo(() => {
    return new FocusController(
      {
        setFocusedDate,
        setFocusedTarget,
      },
      () => statusRef.current,
    );
  }, []);

  const focusApi = useMemo(
    () => ({
      from: {
        focus: () => {
          controller.send('EXTERNAL_FOCUS_REQUEST', { id: 'output-from' });
        },
      },
      to: {
        focus: () => {
          controller.send('EXTERNAL_FOCUS_REQUEST', { id: 'output-to' });
        },
      },
    }),
    [controller],
  );

  useEffect(() => {
    if (!isSliding && !isZooming) {
      controller.send('ANIMATION_END');
    }
  }, [isSliding, isZooming, controller]);

  return {
    focusApi,
    focusedDate,
    focusedTarget,
    controller,
  };
};

export default useFocusManager;
