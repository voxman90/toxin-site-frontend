import { useCallback, useEffect, useRef } from 'react';
import { useWatch } from 'react-hook-form';
import type { Control } from 'react-hook-form';

import type { SearchRoomsFilters } from '../../@types/api/room.api';

interface UseFilterDebounceProps {
  control: Control<SearchRoomsFilters>;
  handleFiltersUpdate: () => void;
  onDebounceChange?: (isDebounce: boolean) => void;
}

const CONTROL_BTN_KEYS = [
  'ArrowRight',
  'ArrowLeft',
  'ArrowUp',
  'ArrowDown',
  'Home',
  'End',
  'PageUp',
  'PageDown',
];

export const useFilterDebounce = ({
  control,
  handleFiltersUpdate,
  onDebounceChange,
}: UseFilterDebounceProps) => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const debounceDelayRef = useRef(200);

  const minPrice = useWatch({ control, name: 'minPrice' });
  const maxPrice = useWatch({ control, name: 'maxPrice' });

  const triggerDebounce = useCallback(
    (delay: number) => {
      onDebounceChange?.(true);

      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(() => {
        handleFiltersUpdate();
        onDebounceChange?.(false);
      }, delay);
    },
    [handleFiltersUpdate, onDebounceChange],
  );

  useEffect(() => {
    triggerDebounce(debounceDelayRef.current);
  }, [minPrice, maxPrice, triggerDebounce]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const onMouseDown = useCallback(() => {
    debounceDelayRef.current = 200;
  }, []);

  const onKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (CONTROL_BTN_KEYS.includes(e.key)) {
      if (e.repeat) {
        debounceDelayRef.current = 200;
      } else {
        debounceDelayRef.current = 600;
      }
    }
  }, []);

  const onKeyUp = useCallback(
    (e: React.KeyboardEvent) => {
      if (CONTROL_BTN_KEYS.includes(e.key)) {
        debounceDelayRef.current = 200;

        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        handleFiltersUpdate();
        onDebounceChange?.(false);
      }
    },
    [handleFiltersUpdate, onDebounceChange],
  );

  return {
    onMouseDown,
    onKeyDown,
    onKeyUp,
  };
};
